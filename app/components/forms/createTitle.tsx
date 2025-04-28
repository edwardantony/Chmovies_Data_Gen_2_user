"use client";
import React, { useState, useRef, useEffect } from "react";
import FormDataComponent from "../createcontent/FormData";
import ImageDataComponent from "../createcontent/ImageData";
import VideoDataComponent from "../createcontent/VideoData";
import { Toaster, toast } from "react-hot-toast";
import uploadFiles from "../ui/UploadFiles";
import { TitleFormData, ImagesDataType ,VideoDataType, VideoFileData, ImageData } from "../createcontent/types";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@mui/material";


const defaultImagesData: ImagesDataType = {
  images: {
    portrait: {
      orientation: "",
      original: null,
      thumbnails: {},
    },
    landscape: {
      orientation: "",
      original: null,
      thumbnails: {},
    },
  },
};

const defaultVideoData: VideoDataType = {
  video: {
    videoFile: null,
    videoUrl: "",
  },
};


const CreateTitle = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TitleFormData>();
  const [imagesData, setImagesData] = useState<ImagesDataType>(defaultImagesData);
  const [videoData, setVideoData] = useState<VideoDataType>(defaultVideoData);
  const [showVideoUpload, setShowVideoUpload] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const titleFormRef = useRef<any>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save Title");
  const [progress, setProgress] = useState({
    subtitles: 0,
    audiotracks: 0,
    images: 0,
    video: 0,
  });

  type ProgressKey = keyof typeof progress | "contentId";

  const updateProgress = (key: ProgressKey, value: number) => {
    setProgress((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormDataUpdate = (updatedFormData: TitleFormData) => {
    setFormData(updatedFormData);
  };

  const handleImageDataChange = (newImagesData: ImagesDataType) => {
    setImagesData(newImagesData);
  };

  const handleVideoChange = (newVideoData: VideoDataType) => {
    setVideoData((prev) => ({ ...prev, ...newVideoData }));
  };

  const handleVideoUploadChange = (showVideoUpload: boolean) => {
    setShowVideoUpload(showVideoUpload);
  };

  const handleValidationError = (errors: { [key: string]: string }) => {
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate Title Form
      const isValid = titleFormRef.current?.validateForm();
      if (isValid) {
        setStep((prevStep) => prevStep + 1);
      }
    } else if (step === 2) {
      // Validate Image Uploads
      const { portrait, landscape } = imagesData?.images;
      const errors: { [key: string]: string } = {};

      if (!portrait?.original?.name) {
        errors.portrait = "Portrait Image is required";
      }
      if (!landscape?.original?.name) {
        errors.landscape = "Landscape Image is required";
      }

      if (Object.keys(errors).length > 0) {
        handleValidationError(errors);
      } else {
        setStep((prevStep) => prevStep + 1);
      }
    }
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleCancelSubmit = () => {
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort();
      console.log("Upload cancelled.");
    }
    if (videoData?.video.videoFile) {
      setDisabled(false);
    }
  };

  const dbUpdate = async (updatedDBData: any) => {
    console.log("Starting bd Update.");

    return toast.promise(
      (async () => {
        try {
          const response = await fetch("http://localhost:5000/api/content/update-content", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDBData),
          });
  
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }
  
          const result = await response.json();
          console.log("✅ DB updated successfully");
          setSaveButtonText("Title Saved")
          return result;
        } catch (error) {
          console.error("❌ Failed to update DB:", error);
          throw error;
        }
      })(),
      {
        loading: "Saving...",
        success: <b>Title Saved Successfuly!</b>,
        error: <b>Could not save your Title.</b>,
      }
    );
  };
  

  const handleSubmitData = async () => {
    
    const subtitleData = formData?.subtitles ?? [];
    const audioTrackData = formData?.audioTracks ?? [];
    const  video = videoData?.video as VideoFileData;
    const titleData = formData?.title;

    try {
      const errors: { [key: string]: string } = {};

      // Validate Video File
      if (showVideoUpload) {
        

        if (!video.videoFile) {
          errors.video = "Video File is required";
        }

        if (Object.keys(errors).length > 0) {
          handleValidationError(errors);
          return;
        }
      }
      setDisabled(true);

      // Save Content Data
      const response = await fetch("http://localhost:5000/api/content/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const rawResponse = await response.text();
      if (!response.ok) {
        throw new Error(`Failed to save step data: ${response.status} ${response.statusText}`);
      }

      const data = JSON.parse(rawResponse);
      const contentId = data?.id as string | "";
      
      // Upload Tasks
      let dbData: Record<string, any> = {};
      dbData["contentId"] = contentId; 
      const uploadTasks = [];
      

      // Upload Subtitles
      if (subtitleData.length > 0) {
        uploadTasks.push(
          uploadFiles(contentId, "metadatas", titleData, "subtitles", subtitleData, uploadControllerRef, updateProgress)
            .then((res) => {
              updateProgress("subtitles", res?.averageProgress);
              dbData["subtitles"] = res.dbData;
              return res;
            })
            .catch((error) => {
              console.error("Subtitle upload failed:", error);
              updateProgress("subtitles", 0);
              return null;
            })
        );
      }

      // Upload Audio Tracks
      if (audioTrackData.length > 0) {
        uploadTasks.push(
          uploadFiles(contentId, "metadatas", titleData, "audiotracks", audioTrackData, uploadControllerRef, updateProgress)
            .then((res) => {
              updateProgress("audiotracks", res?.averageProgress);
              dbData["audiotracks"] = res.dbData;
              return res;
            })
            .catch((error) => {
              console.error("AudoTracks upload failed:", error);
              updateProgress("audiotracks", 0);
              return null;
          })
        );
      }

      // Upload Images
      if (imagesData?.images?.portrait || imagesData?.images?.landscape) {
        const imageDataArray = Object.values(imagesData.images).filter((item) => item !== undefined) as ImageData[];
        uploadTasks.push(
          uploadFiles(contentId, "metadatas", titleData, "images", imageDataArray, uploadControllerRef, updateProgress)
            .then((res) => {
              updateProgress("images", res?.averageProgress);
              dbData["images"] = res.dbData;
              return res;
          })
          .catch((error) => {
              console.error("Images upload failed:", error);
              updateProgress("images", 0);
              return null;
          })
        );
      }

      // Upload Original Video
      if (showVideoUpload && videoData?.video?.videoFile) {
        uploadTasks.push(
          uploadFiles(contentId, "originalvideos", titleData, "video", [video], uploadControllerRef, updateProgress)
            .then((res) => {
              updateProgress("video", res?.averageProgress);
              dbData["video"] = res.dbData;
              return res;
          })
            .catch((error) => {
              console.error("Video upload failed:", error);
              updateProgress("video", 0);
              return null;
          })
        );
      }

      // Execute all uploads in parallel
      const uploaded = await Promise.all(uploadTasks);
      
      if (uploaded.every(res => res)) {
        const updatedDBData = { ...dbData };
        await dbUpdate(updatedDBData);
        console.log("✅ All uploads completed. Database updated.");
      }
      setDisabled(true);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      setDisabled(false);    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`flex-1 text-center py-2 cursor-pointer ${
              step === stepNumber ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => step >= stepNumber && setStep(stepNumber)}
          >
            Step {stepNumber}: {stepNumber === 1 ? "Title Details" : stepNumber === 2 ? "Upload Images" : "Upload Video"}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <FormDataComponent
            ref={titleFormRef}
            onFormDataUpdate={handleFormDataUpdate}
            onValidationError={handleValidationError}
            initialFormData={formData}
          />
          <div className="mt-8 flex justify-end">
          <Button
              onClick={nextStep}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              size="large"
              sx={{
                padding: "8px 24px", 
                fontSize: "1.1rem",
              }}
            >
              Go Next
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Step 2: Upload Images</h2>
          <ImageDataComponent
            imagesData={imagesData}
            onImageDataChange={handleImageDataChange}
            defaultImagesData={defaultImagesData}
          />
          <div className="mt-8 flex justify-between">
            <Button
              onClick={prevStep}
              variant="contained"
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
                padding: "8px 24px",
                fontSize: "1.1rem",
              }}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
            <Button
              onClick={nextStep}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              size="large"
              sx={{
                padding: "8px 24px", 
                fontSize: "1.1rem",
              }}
            >
              Go Next
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Step 3: Upload Video</h2>
          <VideoDataComponent
            onVideoDataChange={handleVideoChange}
            onVideoUploadNow={handleVideoUploadChange}
            defaultVideoData={videoData}
            imageData={imagesData}
            progress={progress}
          />
          <div className="mt-8 flex justify-between">
          <Button
              onClick={prevStep}
              disabled={disabled}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
                "&.Mui-disabled": { backgroundColor: "#b0b0b0", color: "#e0e0e0" },
                padding: "8px 24px", 
                fontSize: "1.1rem",
              }}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
            <div className="flex gap-4">
              {disabled && progress.video !== 100 && (
                <Button
                  onClick={handleCancelSubmit}
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<CancelIcon />}
                  sx={{
                    padding: "8px 24px",
                    fontSize: "1.1rem",
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmitData}
                disabled={disabled}
                variant="contained"
                color="success"
                size="large"
                sx={{
                  backgroundColor: "#22c55e",
                  color: "white",
                  "&:hover": { backgroundColor: "#22c55e" },
                  "&.Mui-disabled": { backgroundColor: "#7fc298", color: "white" },
                  padding: "8px 24px",
                  fontSize: "1.1rem",
                }}
                startIcon={disabled && progress.video !== 100 ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
              >
                {disabled && progress.video !== 100 ? "Saving..." : saveButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTitle;