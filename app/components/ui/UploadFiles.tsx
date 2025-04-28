import uploadFileToS3 from './uploadFileToS3';
import getPresignedUrl from './getPresignedUrl';
import generateFileName from './generateFileName';
import { UploadFiles, UploadResult, VideoFileData, ImageData, FormDataFile } from "../createcontent/types";


const uploadFiles = async (
  contentId: string,
  toFolder: string,
  title: string | undefined,
  Uploadtype: "images" | "subtitles" | "audiotracks" | "video",
  files: UploadFiles,
  uploadControllerRef?: React.RefObject<AbortController | null>,
  onProgressUpdate?: (key: "subtitles" | "audiotracks" | "images" | "video", value: number) => void,
): Promise<{ results?: UploadResult[]; averageProgress: number, dbData: any }> => {
  const allProgresses: number[] = [];
  const results: UploadResult[] = [];
  const safeTitle = title || "untitled";
  const resultImg: { fileName: string; fileType: string; url: string; s3Key:string; progress: number }[][] = [];
  const dbData: Record<string, any> = {};

  // Ensure `files` is always an array
  if (files && typeof files === "object" && !Array.isArray(files)) {
    files = Object.values(files).filter((item) => item !== undefined) as ImageData[];
  }

  if (!Array.isArray(files)) {
    throw new Error("Files is not an array and cannot be processed.");
  }

  if (!title) {
    throw new Error("Title is missing.");
  }

  if (uploadControllerRef) {
    if (uploadControllerRef.current) {
      console.log("Aborting previous upload...");
      uploadControllerRef.current.abort(); 
    }
    uploadControllerRef.current = new AbortController(); 
    console.log("New AbortController created.");
  }
  const signal = uploadControllerRef?.current?.signal;

  const uploadFile = async (file: File, fileName: string, fileType: string, onProgressUpdate: (progress: number) => void) => {
    const presignedUrlData = await getPresignedUrl(contentId, toFolder, fileName, fileType);
    if (!presignedUrlData) {
      throw new Error("Failed to get pre-signed URL");
    }

    let uploadProgress = 0;

    const uploadSuccess = await uploadFileToS3({
      presignedUrl: presignedUrlData.presignedUrl,
      file,
      key: presignedUrlData.key,
      type: Uploadtype,
      signal,
      onUploadComplete: (success, url) => {
        if (success) {
          console.log(`✅ File uploaded successfully: ${url}`);
        } else {
          console.error(`❌ File upload failed`);
        }
      },
      onProgressUpdate: (progress) => {
        uploadProgress = progress;
        onProgressUpdate(progress);
      },
    });

    if (!uploadSuccess) {
      throw new Error(`Failed to upload file: ${file.name}`);
    }

    return {
      fileName: fileName,
      fileType: fileType,
      url: `http://chmovies-gen-2-file-upload.s3.ap-south-1.amazonaws.com/${presignedUrlData.key}`,
      s3Key: presignedUrlData.key,
      progress: uploadProgress,
    };
  };

  const handleFormDataUpload = async (item: FormDataFile) => {
    const { language, file } = item;
    const text = Uploadtype == "subtitles" ? "subtitle" : "audiotrack";

    if (!file?.name) {
      console.error("❌ File object is missing a valid 'name' property:", item);
      throw new Error("Invalid file: Missing 'name' property.");
    }

    const fileExtension = file.name.split('.').pop() || "";   
    const fileType = Uploadtype === "subtitles" ? "application/x-subrip" : file.type;
    const generatedName = generateFileName(safeTitle, text, language.toLowerCase());
    const newFilename = [generatedName, fileExtension].filter(Boolean).join(".");

    const result = await uploadFile(file, newFilename, fileType, (progress) => {
     // console.log(`Upload progress for ${file.name}: ${progress}%`);
      if (onProgressUpdate) {
        onProgressUpdate(Uploadtype, progress);
      }
    });

    allProgresses.push(result.progress);
    results.push(result);

    const languageKey = language.toLowerCase();

    if (!dbData[languageKey]) {
      dbData[languageKey] = {};
    }
    
    dbData[languageKey] = {
      fileName: result.fileName,
      fileType: fileType,
      url: result?.url,
      s3Key: result?.s3Key,
      language, 
    };

    return result;
  };

  const handleImageUpload = async (item: ImageData) => {
    const { original, thumbnails, orientation } = item;
  
    if (!original) {
      throw new Error("Original file is missing.");
    }
  
    // Upload original file
    const originalResult = await (async () => {
      const fileExtension = original.name.split('.').pop() || "";
      const generatedName = generateFileName(safeTitle, "image", `${orientation}_original_1080p`);
      const newOriginalFilename = [generatedName, fileExtension].filter(Boolean).join(".");
  
      return await uploadFile(original, newOriginalFilename, original?.type, (progress) => {
        //console.log(`Upload progress for ${original?.name}: ${progress}%`);
        if (onProgressUpdate) {
          onProgressUpdate("images", progress);
        }
      });
    })();

    allProgresses.push(originalResult.progress);
    resultImg.push([originalResult]);

    if (!dbData[orientation]) {
      dbData[orientation] = { original: {}, thumbnails: {} };
    }
    
    dbData[orientation].original = {
      fileName: originalResult.fileName,
      fileType: original?.type,
      s3Key: originalResult.s3Key,
      url: originalResult.url,
      resolution: "1080p",
      orientation,
    };
  
    
  
    if (!thumbnails || Object.keys(thumbnails).length === 0) {
      throw new Error("Thumbnails are missing.");
    }
  
    // Upload thumbnails
    const thumbnailResults = await Promise.all(
      Object.entries(thumbnails).map(async ([resolution, fileObj]) => {
        const file = fileObj as File;
        const fileExtension = file.name.split('.').pop() || "";
        const generatedName = generateFileName(safeTitle, "image", `${orientation}_thumbnail_${resolution}`);
        const newThumbFilename = [generatedName, fileExtension].filter(Boolean).join(".");
  
        const result = await uploadFile(file, newThumbFilename, file?.type, (progress) => {
        //  console.log(`Upload progress for ${file?.name}: ${progress}%`);
          if (onProgressUpdate) {
            onProgressUpdate("images", progress);
          }
        });

        allProgresses.push(result.progress);
        resultImg.push([result]);

        if (!dbData[orientation].thumbnails) {
          dbData[orientation].thumbnails = {};
        }
  
        dbData[orientation].thumbnails[resolution] = {
          fileName: result?.fileName,
          fileType: file?.type,
          s3Key: result?.s3Key,
          url: result?.url,
          resolution,
          orientation,
        };
        
  
        return result;
      })
    );
  
    return [originalResult, ...thumbnailResults];
  };


  const handleOriginalVideoUpload = async (item: VideoFileData) => {
    const videoFile = item.videoFile;
    console.log("Processing video file:", videoFile);
  
    if (!videoFile) {
      console.error("❌ File object is missing:", videoFile);
      throw new Error("Invalid file: File is missing.");
    }
  
    const fileExtension = videoFile.name.split('.').pop() || "";
    const generatedName = generateFileName(safeTitle, Uploadtype, "original_hd");
    const newFilename = [generatedName, fileExtension].filter(Boolean).join(".");    
    const result = await uploadFile(videoFile, newFilename, videoFile.type, (progress) => {
     // console.log(`Upload progress for ${videoFile.name}: ${progress}%`);
      if (onProgressUpdate) {
        onProgressUpdate("video", progress);
      }
    });
  
    allProgresses.push(result.progress);
    results.push(result);

    if (!dbData.original) {
      dbData.original = {} ;
    }
    
    dbData.original = {
      fileName: result?.fileName,
      fileType: videoFile?.type,
      url: result?.url,
      s3Key: result?.s3Key,
    };
  
    return result;
  };

  if (Uploadtype === "subtitles" || Uploadtype === "audiotracks") {
    const formDataArray = Object.values(files);
    const uploadResults = await Promise.all(formDataArray.map(handleFormDataUpload));
    const totalProgress = allProgresses.reduce((sum, progress) => sum + progress, 0);
    const averageProgress = totalProgress / allProgresses.length;

    return { averageProgress, dbData };
  }


  if (Uploadtype === "images") {
    files = Object.values(files).filter((item) => item !== undefined) as ImageData[];
    const uploadResults = await Promise.all(files.map(handleImageUpload));
    const totalProgress = allProgresses.reduce((sum, progress) => sum + progress, 0);
    const averageProgress = totalProgress / allProgresses.length;

    return { averageProgress, dbData };
  }
  

  if (Uploadtype === "video") {    
    const videoDataArray = Object.values(files);
    const uploadResults = await Promise.all(videoDataArray.map(handleOriginalVideoUpload));
    const totalProgress = allProgresses.reduce((sum, progress) => sum + progress, 0);
    const averageProgress = totalProgress / allProgresses.length;
 
    return { averageProgress, dbData };
  }



  throw new Error(`Unsupported file type: ${Uploadtype}`);
};

export default uploadFiles;