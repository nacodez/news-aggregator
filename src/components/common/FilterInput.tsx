import React from "react";
import { FilterInputProps } from "../../types/types";

const FilterInput: React.FC<FilterInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  options,
}) => {
  const baseClass =
    "p-3 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";
  const fixedWidthClass = "w-60";
  if (type === "select" && options) {
    return (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${baseClass} ${fixedWidthClass}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClass} ${
        type === "text" ? "w-full md:w-1/4" : ""
      } ${fixedWidthClass}`}
    />
  );
};

export default FilterInput;
