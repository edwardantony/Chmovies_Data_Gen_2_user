import React, { useState } from "react";
import { Chip, TextField, IconButton } from "@mui/material";
import { IoMdClose, IoMdAdd } from "react-icons/io";

interface MultiTagInputProps {
  label: string;
  extraTags: string[];
  setExtraTags: (extraTags: string[]) => void;
}

const MultiTagInput: React.FC<MultiTagInputProps> = ({ label, extraTags, setExtraTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddExtraTag = () => {
    if (inputValue.trim() && !extraTags.includes(inputValue)) {
      setExtraTags([...extraTags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleDeleteExtraTags = (tag: string) => {
    setExtraTags(extraTags.filter((s) => s !== tag));
  };

  return (
    <div className="w-full bg-white border border-gray-300 p-2 rounded-lg">
      {/* Input Field */}
      <div className="flex items-center gap-2 bg-white rounded-lg">
      <TextField
          label={label}
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddExtraTag()}
          className="flex-1 gap-2 bg-white cursor-pointer rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 focus:outline-none"
          sx={{ height: 55, "& .MuiOutlinedInput-root": { height: 55 } }}  // Set height properly
        />
        <IconButton onClick={handleAddExtraTag} color="primary" className="mx-3" disabled={!inputValue} >
          <IoMdAdd size={24}  />
        </IconButton>
      </div>

      {/* Display Added ExtraTags */}
      {extraTags.length > 0 && (
        <div className="flex flex-wrap gap-2 w-full mt-2 border border-gray-300 bg-white rounded-lg p-2">
          {extraTags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteExtraTags(tag)}
              className="bg-blue-500 text-white"
              deleteIcon={<IoMdClose />}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiTagInput;
