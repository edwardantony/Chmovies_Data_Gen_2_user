interface UploadProps {
    presignedUrl: string;
    file: File;
    key: string;
    type: "images" | "subtitles" | "audiotracks" | "video";
    signal: any,
    onUploadComplete: (success: boolean, url?: string) => void;
    onProgressUpdate: (progress: number) => void; 
  }
  
  const uploadFileToS3 = ({
    presignedUrl,
    file,
    key,
    type,
    signal,
    onUploadComplete,
    onProgressUpdate,
  }: UploadProps): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);
  
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgressUpdate(progress); // Send progress to parent
        }
      };
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log(`✅ ${type} uploaded successfully!`);
          const fileUrl = `http://chmovies-gen-2-file-upload.s3.ap-south-1.amazonaws.com/${key}`;
          onUploadComplete(true, fileUrl);
          resolve(true);
        } else {
          console.error(`❌ Error uploading ${type}:`, xhr.statusText);
          onUploadComplete(false);
          reject(false);
        }
      };
  
      xhr.onerror = () => {
        console.error(`❌ Network error while uploading ${type}`);
        onUploadComplete(false);
        reject(false);
      };

    
    if (signal) {
      signal.addEventListener("abort", () => {
        console.warn(`⏹️ Upload aborted for ${file.name}`);
        xhr.abort();
        onUploadComplete(false);
        reject(new Error("Upload aborted"));
      });
    }
  
      xhr.send(file);
    });
  };
  
  export default uploadFileToS3;