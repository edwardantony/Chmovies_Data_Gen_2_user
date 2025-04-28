"use client";
import React from "react";
import { toast } from "react-hot-toast";
import { resizeImage, generateThumbnails, getHeightClass } from "../lib/imageUtils";

// Define the ImageUploadProps interface
type ImageType = "portrait" | "landscape";
type ThumbnailSet = { [key: string]: File };

interface ImageData {
  orientation: string | "";
  original: File | null;
  thumbnails: ThumbnailSet;
}

interface ImagesDataType {
  images: {
    portrait?: ImageData | undefined;
    landscape?: ImageData | undefined;
  };
}

interface ImageUploadProps {
  type: ImageType;
  imagesData: ImagesDataType;
  onImageDataChange: (newImagesData: ImagesDataType) => void;
  defaultImagesData?: ImagesDataType;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  imagesData,
  onImageDataChange,
  defaultImagesData,
}) => {
  const previewResolutions = ["720p", "480p", "360p"];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.[0]) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = async (event) => {
        const image = new Image();
        image.src = event.target?.result as string;

        image.onload = async () => {
          const targetHeight = type === "portrait" ? 1920 : 1080; // Target height for the original image
          const filename = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension

          try {
            // Resize the original image
            const resizedImage = await resizeImage(image, targetHeight, `${filename}_original.jpg`);
            
            // Generate thumbnails for preview resolutions
            const thumbnails = await generateThumbnails(image, filename, previewResolutions);
            console.log(thumbnails);

            // Update the imagesData state
            const newImagesData: ImagesDataType = {
              ...imagesData,
              images: {
                ...imagesData?.images,
                [type]: {
                  orientation: type,
                  original: resizedImage,
                  thumbnails: {
                    ...thumbnails,
                  },
                },
              },
            };
            onImageDataChange(newImagesData);
            
          } catch (error) {
            console.error("Failed to process image:", error);
            toast.error("Failed to process image. Please try again.");
          }
        };

        image.onerror = () => {
          console.error("Failed to load image");
          toast.error("Failed to load image. Please try again.");
        };
      };

      reader.onerror = () => {
        console.error("Failed to read file");
        toast.error("Failed to read file. Please try again.");
      };

      reader.readAsDataURL(files[0]);
    }
  };

  const imageLabel =
    type === "portrait" ? "Portrait Image (1080x1920)" : "Landscape Image (1920x1080)";

  const currentImage = imagesData?.images?.[type]; // Access the correct image type

  return (
    <div className="mb-8">
      {/* Image Upload Section */}
      <div className="flex-1 border-b-2 border-gray-300 p-2 mb-4">
        <label className="block text-sm font-medium text-gray-700">{imageLabel}</label>
      </div>

      <div className="mt-1">
        {currentImage?.original ? (
          <div className="w-full h-[400px] flex items-center justify-center overflow-hidden rounded">
            <img
              src={URL.createObjectURL(currentImage.original)} // Use a temporary URL for preview
              alt={`${type} Preview`}
              className={type === "portrait" ? "h-full w-auto object-cover" : "w-full h-auto object-cover"}
            />
          </div>
        ) : (
          <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id={`${type}Upload`}
        />
        <label
          htmlFor={`${type}Upload`}
          className="mt-2 block w-full px-4 py-2 bg-blue-500 text-white text-center rounded cursor-pointer hover:bg-blue-600"
        >
          Choose File
        </label>
      </div>

      {/* Image Previews Section */}
      <div className="mt-6">
        <div className="flex-1 border-b-2 border-gray-300 p-2 mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {type === "portrait" ? "Portrait Previews" : "Landscape Previews"}
          </label>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {previewResolutions.map((resolution, index) => {
            const thumbnail = currentImage?.thumbnails?.[resolution]; // Access the specific thumbnail File
            const heightClass = getHeightClass(resolution, type === "portrait");

            return (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-full ${heightClass} bg-gray-200 flex items-center justify-center rounded`}>
                  {thumbnail ? (
                    <img
                      src={URL.createObjectURL(thumbnail)} // Pass the File object here
                      alt={`${type === "portrait" ? "Portrait" : "Landscape"} Preview ${resolution}`}
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
                <span className="mt-2 text-sm text-gray-600">{resolution}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;