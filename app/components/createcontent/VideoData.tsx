"use client";
import React, { useState, useEffect } from "react";
import VideoPreview from '../ui/VideoPreview';
import FileUpload from "../ui/FileUpload";
import ImagePreview from "../ui/ImagePreview";
import UploadProgress from "../ui/UploadProgress";
import {  VideoDataType, ProgressType, ImagesDataType } from "./types";


interface VideoUploadProps {
  onVideoDataChange: (newVideoData: VideoDataType) => void;
  onVideoUploadNow: (showVideoUpload: boolean) => void;
  defaultVideoData: VideoDataType;
  imageData: ImagesDataType;
  progress: ProgressType;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoDataChange,
  onVideoUploadNow,
  defaultVideoData,
  imageData,
  progress,
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(defaultVideoData?.video?.videoFile || null);
  const [videoUrl, setVideoUrl] = useState<string>(defaultVideoData?.video?.videoUrl || "");
  const [showVideoUpload, setShowVideoUpload] = useState<boolean>(true);

  // Update state if defaultVideoData changes
  useEffect(() => {
    setVideoFile(defaultVideoData?.video?.videoFile || null);
    setVideoUrl(defaultVideoData?.video?.videoUrl || "");
  }, [defaultVideoData]);

  

  const handleClickLater = () => {
    setVideoFile(null);
    setVideoUrl("");
    setShowVideoUpload(false);
    onVideoUploadNow(false);

    // Notify the parent component of the change
    onVideoDataChange({ video: { videoFile: null, videoUrl: "" } });
  };

  const handleClickUploadNow = () => {
    setShowVideoUpload(true);
    onVideoUploadNow(true);
  };

  const handleFileSelect = ({ file, fileDetails }: { file: File | null; fileDetails: any }) => {
    setVideoFile(file);
    setVideoUrl(fileDetails?.tempUrl || "");

    // Notify the parent component of the change
    const newVideoData: VideoDataType = {
      video: {
        videoFile: file,
        videoUrl: fileDetails?.tempUrl,
      },
    };
    onVideoDataChange(newVideoData);
  };
 
  return (
    <div>
      <div className="flex w-full items-center gap-4">
        {/* Left Section: Buttons and File Upload */}
        <div className="w-[60%] flex flex-col items-start space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={handleClickLater}
              className={`px-6 py-2 rounded ${
                !showVideoUpload
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Video Upload Later
            </button>
            <button
              onClick={handleClickUploadNow}
              className={`px-6 py-2 rounded ${
                showVideoUpload
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Video Upload Now
            </button>
          
            {showVideoUpload && (
              <FileUpload onFileSelect={handleFileSelect} allowedTypes={["mp4", "mov"]} />
            )}
            </div>
        </div>

        {/* Right Section: Image Preview */}
        <div className="w-[40%] flex justify-center">
          <ImagePreview imageData={imageData} />
        </div>
      </div>

      <div className="flex gap-2 w-full">
        {/* Video Preview (60%) if video exists */}
        {videoUrl && (
          <div className="w-[60%]">
            <VideoPreview videoUrl={videoUrl} />
          </div>
        )}

        {/* Progress Section (40% if video, 100% if no video) */}
        <div className={`${videoUrl ? "w-[40%]" : "w-full"} mt-6`}>
          {["Subtitles", "AudioTracks", "Images", "Video"].map((type) => {
            const progressValue = progress[type.toLowerCase()];
            return progressValue > 0 ? <UploadProgress key={type} progress={progressValue} type={type} /> : null;
          })}
        </div>
      </div>



    </div>
  );
};

export default VideoUpload;