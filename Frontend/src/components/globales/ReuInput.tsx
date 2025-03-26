import React from "react";
import { Input } from "@heroui/react";

interface OptionType {
  value: string | number;
  label: string;
}

interface ReusableInputProps {
  label: string;
  placeholder?: string;
  type: string;
  radius?: "full" | "lg" | "md" | "sm" | "none";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: OptionType[];
  required?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export const ReuInput: React.FC<ReusableInputProps> = ({
  label,
  placeholder,
  type,
  radius = "md",
  value,
  onChange,
  options,
  required = false,
  min,
  max,
  className = ""
}) => {
  if (type === "select" && options) {
    return (
      <div className={`w-full ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          className={`w-full px-4 py-2 border border-gray-300 rounded-${
            radius === "full" ? "full" : radius === "lg" ? "lg" : radius === "sm" ? "sm" : "md"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={value}
          onChange={onChange}
          required={required}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        className="w-full"
        type={type}
        placeholder={placeholder}
        radius={radius}
        value={value.toString()}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
};