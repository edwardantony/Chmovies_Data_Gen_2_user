import React from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface CustomDatePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ label = "Select Date", value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        openTo="year"
        onChange={(newValue, context) => {
          if (dayjs.isDayjs(newValue) || newValue === null) {
            onChange(newValue);
          }
        }}
        slotProps={{
            textField: {
              fullWidth: true,
              className:"bg-white text-gray-700 rounded-lg border border-gray-300 hover:border-transparent focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none shadow-sm",
            },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
