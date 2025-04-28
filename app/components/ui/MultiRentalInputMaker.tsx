import React, { JSX } from "react";
import { Select, MenuItem, IconButton, TextField } from "@mui/material";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

interface RentalEntry {
  type: string;
  price: string;
  currency: string;
}

interface MultiRentalInputMakerProps {
  rentalList: RentalEntry[];
  handleRentType: (rentalPlans: RentalEntry[]) => void;
  rentalOptions: string[];
}

const currencyIcons: Record<"USD" | "INR", JSX.Element> = {
  USD: <AttachMoneyIcon className="mr-1 text-gray-600 text-[18px]" />,
  INR: <CurrencyRupeeIcon className="mr-1 text-gray-600 text-[18px]" />,
};

const currencyOptions = ["INR", "USD"];

const MultiRentalInputMaker: React.FC<MultiRentalInputMakerProps> = ({
  rentalList,
  handleRentType,
  rentalOptions,
}) => {
  const [selectedType, setSelectedType] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("INR");

  // Get used currencies per type
  const typeCurrencyMap: Record<string, string[]> = rentalList.reduce((acc, entry) => {
    if (!acc[entry.type]) acc[entry.type] = [];
    acc[entry.type].push(entry.currency);
    return acc;
  }, {} as Record<string, string[]>);

  // Available currencies for the selected type
  const availableCurrencies = currencyOptions.filter(
    (cur) => !(selectedType && typeCurrencyMap[selectedType]?.includes(cur))
  );

  // Hide types when all currencies are used
  const usedTypes = Object.keys(typeCurrencyMap);
  const shouldHideType = (type: string) =>
    typeCurrencyMap[type]?.length === currencyOptions.length;

  const handleAddEntry = () => {
    if (selectedType && price && currency) {
      const newRentalPlan: RentalEntry = {
        type: selectedType,
        price: parseFloat(price).toFixed(2),
        currency,
      };

      // Update the rental list
      const updatedRentalPlans = [...rentalList, newRentalPlan];
      handleRentType(updatedRentalPlans);

      // Reset the form fields
      setSelectedType("");
      setPrice("");
      setCurrency("INR");
    }
  };

  const handleDeleteEntry = (index: number) => {
    // Remove the rental entry at the specified index
    const updatedRentalPlans = rentalList.filter((_, i) => i !== index);
    handleRentType(updatedRentalPlans);
  };

  const handlePriceChange = (value: string) => {
    const formattedValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setPrice(formattedValue);
  };

  return (
    <div className="w-full border border-gray-300 shadow-sm rounded-lg">
      {/* Input Row */}
      <div className={`flex items-center justify-between gap-3 p-2 bg-white rounded-t-lg ${rentalList.length ? '' : 'rounded-b-lg'}`}>
        {/* Select Rental Type */}
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          displayEmpty
          className="flex-1 min-w-[120px] bg-white text-gray-700"
        >
          <MenuItem value="" disabled>
            Select Type
          </MenuItem>
          {rentalOptions
            .filter((option) => !shouldHideType(option))
            .map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </Select>

        {/* Price Input */}
        <TextField
          type="text"
          value={price}
          onChange={(e) => handlePriceChange(e.target.value)}
          onBlur={() => setPrice((prev) => (prev ? parseFloat(prev).toFixed(2) : ""))}
          placeholder="Enter Price"
          className="flex-1 min-w-[120px] bg-white text-gray-700"
        />

        {/* Currency Selection */}
        <Select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="flex-1 min-w-[100px] bg-white text-gray-700"
          displayEmpty
        >
          <MenuItem value="" disabled>
            <span className="text-gray-400">Select Currency</span>
          </MenuItem>
          {availableCurrencies.map((cur) => (
            <MenuItem key={cur} value={cur} className="flex items-center">
              {currencyIcons[cur as "USD" | "INR"] ?? null} {cur}
            </MenuItem>
          ))}
        </Select>

        {/* Add Button */}
        <IconButton
          className="mr-3"
          onClick={handleAddEntry}
          color="primary"
          disabled={!selectedType || !price || !currency}
        >
          <IoMdAdd size={24} />
        </IconButton>
      </div>

      {/* Display Selected Rental Plans */}
      {rentalList.length > 0 && (
        <div className="space-y-2 bg-white p-4 rounded-b-lg">
          {rentalList.map((entry, index) => (
            <div key={index} className="flex items-center justify-between border p-2 rounded-lg border-green-300 bg-green-100">
              <span className="flex-1 min-w-[120px]">{entry.type}</span>
              <span className="flex-1 min-w-[120px]">{entry.price}</span>
              <span className="flex-1 min-w-[100px]">{entry.currency}</span>
              <IconButton onClick={() => handleDeleteEntry(index)} color="error">
                <IoMdClose size={20} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiRentalInputMaker;