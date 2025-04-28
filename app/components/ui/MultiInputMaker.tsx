import React, { useEffect } from "react";
import { Select, MenuItem, IconButton } from "@mui/material";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import { FormDataFile } from "../createcontent/types";


interface MultiInputMakerProps {
  label: string; 
  labelInput: string; 
  mediaList: FormDataFile[];
  setMediaList: React.Dispatch<React.SetStateAction<FormDataFile[]>>;
  languageOptions: { code: string; label: string }[];
}

const MultiInputMaker: React.FC<MultiInputMakerProps> = ({ 
  label, 
  labelInput, 
  mediaList, 
  setMediaList, 
  languageOptions 
}) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState("");

  const handleAddEntry = () => {
    if (selectedLanguage && !mediaList.some((entry) => entry.language === selectedLanguage)) {
      setMediaList((prev) => [
        ...prev,
        { language: selectedLanguage, labelInput, file: prev.find((e) => e.language === selectedLanguage)?.file || null }
      ]);
      setSelectedLanguage(""); // Reset after adding
    }
  };
  
  const handleDeleteEntry = (language: string) => {
    setMediaList((prev) => prev.filter((entry) => entry.language !== language));
  };
  
  const handleFileChange = (language: string, file: File | null) => {
    setMediaList((prev) =>
      prev.map((entry) =>
        entry.language === language ? { ...entry, file: file || entry.file } : entry
      )
    );
  };

  // useEffect to load file if it exists in mediaList
  useEffect(() => {
    mediaList.forEach((entry) => {
      if (entry.file) {
        console.log(`File for ${entry.language} added`);
      }
    });
  }, [mediaList]);

  return (
    <div className="w-full border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-semibold">{label}</h2>

      {/* Language Selection */}
      <div className="flex items-center gap-2 p-2">
        <Select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          displayEmpty
          className="flex-1 bg-white h-[55px] "
        >
          <MenuItem value="" disabled>
            <span className="text-sm font-medium text-gray-400">Select {labelInput} Language</span>
          </MenuItem>
          {languageOptions
            .filter((lang) => !mediaList.some((entry) => entry.language === lang.code))
            .map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>{lang.label}</MenuItem>
            ))}
        </Select>
        <IconButton className="mr-2" onClick={handleAddEntry} color="primary" disabled={!selectedLanguage}>
          <IoMdAdd size={24} />
        </IconButton>
      </div>

      {/* Selected Media Entries */}
      {mediaList.length > 0 && (
        <div className="flex flex-col gap-3 m-2">
          {mediaList.map((entry) => (
            <div
            key={entry.language}
            className={`flex items-center px-4 py-2 gap-3  rounded-lg border shadow-sm transition-all ${
              entry.file ? "border-green-300 bg-green-100" : "border-red-300 bg-red-100"
            }`}
          >
            {/* Language Label */}
            <span className="text-sm font-medium w-24 text-gray-700">
              {languageOptions.find((lang) => lang.code === entry.language)?.label}
            </span>
            
            {/* File Input */}
            <input
              type="file"
              accept={labelInput=="Subtitle" ? ".srt, .vtt" : ".mp3,.wav,.aac"}
              onChange={(e) => handleFileChange(entry.language, e.target.files?.[0] || null)}
              className="w-full file:border-none file:bg-white file:text-gray-600 file:px-3 file:py-1 file:rounded-md file:cursor-pointer"
            />
          
            {/* Remove Button */}
            <IconButton onClick={() => handleDeleteEntry(entry.language)} color="error">
              <IoMdClose size={20} />
            </IconButton>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiInputMaker;