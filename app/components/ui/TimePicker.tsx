import React from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface CustomTimePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (time: Dayjs | null) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        className=""
        label={label}
        value={value}
        format="HH:mm:ss"
        views={["hours", "minutes", "seconds"]} 
        ampm={false}
        onChange={(newValue, context) => {
            if (dayjs.isDayjs(newValue) || newValue === null) {
                onChange(newValue);
            }
        }}
        slotProps={{
            textField: {
              fullWidth: true,
              className: "bg-white text-gray-700 rounded-lg rounded-lgborder border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none shadow-sm",
            },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomTimePicker;
