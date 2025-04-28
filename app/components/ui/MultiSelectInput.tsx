import React, { useState, useRef, useEffect } from "react";
import { Chip } from "@mui/material";
import { FaArrowLeftLong } from "react-icons/fa6";

interface MultiSelectInputProps {
  label?: string;
  labelInput?: string;
  predefinedOptions: Record<string, string>; // Object with key-value pairs
  selectedValues: string[]; // Parent state values
  setSelectedValues: (values: string[]) => void; // Parent state setter
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ 
  label = "Select Options", 
  labelInput = "",
  predefinedOptions, 
  selectedValues, 
  setSelectedValues 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key: string) => {
    if (!selectedValues.includes(key)) {
      setSelectedValues([...selectedValues, key]);
    }
  };

  const handleDelete = (key: string) => {
    setSelectedValues(selectedValues.filter((item) => item !== key));
  };

  return (
    <div className="relative w-full bg-white border border-gray-300 p-2 rounded-lg" ref={dropdownRef}>
      {/* Input Field */}
      <div
        className="flex flex-wrap items-center gap-2 bg-white px-3 py-2 min-h-[55px] cursor-pointer rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedValues.length > 0 ? (
          selectedValues.map((key) => (
            <Chip
              key={key}
              label={predefinedOptions[key]} // Display country name
              onDelete={() => handleDelete(key)}
              className="bg-blue-500 text-white"
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">Add {labelInput} Options...</p>
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && selectedValues.length < Object.keys(predefinedOptions).length && (
        <div className="absolute w-full mt-2 border border-gray-300 bg-white rounded-lg p-2 z-10 left-0">          
          <div className="flex flex-wrap gap-2">
            {Object.entries(predefinedOptions)
              .filter(([key]) => !selectedValues.includes(key))
              .map(([key, value]) => (
                <Chip
                  key={key}
                  label={value} // Show country name
                  onClick={() => handleSelect(key)}
                  className="cursor-pointer bg-gray-200 hover:bg-blue-500 hover:text-white transition"
                />
              ))}
              <label className="ml-4 text-xs font-medium text-blue-500 flex items-center gap-1">
              <FaArrowLeftLong className="text-blue-400" />
              Choose option to add
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectInput;
