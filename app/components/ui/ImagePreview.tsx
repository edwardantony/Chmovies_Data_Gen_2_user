import React from "react";
import { ImagesDataType } from "../createcontent/types";

interface ImagePreviewProps {
  imageData: ImagesDataType;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageData }) => {
  const { portrait, landscape } = imageData.images;

  const ImageComponent = ({ file, alt }: { file: File | null | undefined; alt: string }) => {
    if (!file) return <p className="text-gray-500">No {alt.toLowerCase()} image selected.</p>;

    return (
      <div className="w-full">
        <img
          src={URL.createObjectURL(file)}
          alt={`${alt} Preview`}
          className="w-full max-h-[130px] object-contain rounded-lg bg-gray-700 shadow-md"
          onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)} // Clean up memory
          onError={(e) => {
            console.error(`Failed to load ${alt.toLowerCase()} image:`, file.name);
            e.currentTarget.style.display = "none"; // Hide the broken image
          }}
        />
      </div>
    );
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-2 gap-4">
        <ImageComponent file={portrait?.original} alt="Portrait" />
        <ImageComponent file={landscape?.original} alt="Landscape" />
      </div>
    </div>
  );
};

export default ImagePreview;