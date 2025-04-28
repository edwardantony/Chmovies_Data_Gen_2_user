"use client";
import React from "react";
import ImageUpload from "../ui/ImageUpload";
import { ImagesDataType  } from "./types";

interface ImageUploadProps {
  imagesData: ImagesDataType;
  onImageDataChange: (newImagesData: ImagesDataType) => void;
  defaultImagesData?: ImagesDataType;
}

const ImageDataComponent: React.FC<ImageUploadProps> = ({
  imagesData,
  onImageDataChange,
  defaultImagesData,
}) => {
  return (
    <div>
      <div className="flex space-x-6">
        {/* Portrait Image Upload */}
        <div className="flex-1">
          <ImageUpload
            type="portrait"
            imagesData={imagesData}
            onImageDataChange={onImageDataChange}
            defaultImagesData={defaultImagesData}
          />
        </div>

        {/* Landscape Image Upload */}
        <div className="flex-1">
          <ImageUpload
            type="landscape"
            imagesData={imagesData}
            onImageDataChange={onImageDataChange}
            defaultImagesData={defaultImagesData}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageDataComponent;