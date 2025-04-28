import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Define file details interface
interface FileDetails {
  name: string;
  size: number;
  type: string;
  tempUrl: string;
}

// Props interface with allowedTypes as an array of extensions
interface FileUploadProps {
  onFileSelect: (data: { file: File | null; fileDetails: FileDetails | null }) => void;
  allowedTypes?: string[]; // Example: ["png", "jpeg", "pdf", "mp4", "mov"]
}

// Map file extensions to MIME types
const extensionToMimeType: Record<string, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  pdf: "application/pdf",
  mp4: "video/mp4",
  mov: "video/quicktime",
  aac: "audio/aac",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  flac: "audio/flac",
  srt: "application/x-subrip",
  vtt: "text/vtt",
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, allowedTypes = [] }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Convert extensions to MIME types for the input accept attribute
  const allowedMimeTypes = allowedTypes.map((ext) => extensionToMimeType[ext] || "").filter(Boolean);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

      // Check if the file extension is allowed
      if (allowedTypes.length > 0 && !allowedTypes.includes(fileExt)) {
        setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
        setSelectedFile(null);
        setFileDetails(null);
        onFileSelect({ file: null, fileDetails: null }); // Notify parent
        return;
      }

      const details: FileDetails = {
        name: file.name,
        size: file.size,
        type: file.type || extensionToMimeType[fileExt] || "unknown",
        tempUrl: URL.createObjectURL(file),
      };

      setError(null);
      setSelectedFile(file);
      setFileDetails(details);
      onFileSelect({ file, fileDetails: details }); // Notify parent
    } else {
      setSelectedFile(null);
      setFileDetails(null);
      onFileSelect({ file: null, fileDetails: null }); // Notify parent
    }
  };

  return (
    <div className="w-200 rounded-md border border-green-500 bg-gray-50 px-4 py-1 shadow-md">
      <label htmlFor="upload" className="flex flex-row items-center gap-2 cursor-pointer">
        <CloudUploadIcon className="text-green-500" fontSize="large" />
        <span className="text-gray-600 text-lg">Select File</span>
      </label>
      <input
        id="upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={allowedMimeTypes.join(", ")}
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;