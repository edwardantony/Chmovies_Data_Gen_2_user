import React from "react";

interface UploadProgressProps {
  progress: number;
  type: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, type }) => {
  const getColor = (type: string) => {
    const colors: Record<string, string> = {
      Subtitles: "bg-blue-500",
      AudioTracks: "bg-green-500",
      Images: "bg-yellow-500",
      Video: "bg-red-500",
    };
  
    return colors[type] || "bg-gray-500";
  };

 return (
    <div className="p-2 bg-white shadow-md rounded-lg mb-4">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">{type} Upload Progress</h2>

      <div className="w-full h-3 bg-gray-200 rounded-md overflow-hidden relative">
        <div
          className={`${getColor(type)} text-xs font-medium text-white text-center flex items-center justify-center h-full transition-all duration-300 ease-in-out`}
          style={{ width: `${progress}%` }}
        >
          {progress > 0 && <span className="text-white text-xs font-semibold">{Math.round(progress)}%</span>}
        </div>
      </div>

      {progress <= 0 && <p className="text-xs text-gray-700 mt-1">{Math.round(progress)}% Complete</p>}
      {progress === 100 && <div className="mt-2 text-xs text-green-600 font-semibold">{type} uploaded successfully!</div>}
    </div>
  );
};

export default UploadProgress;
