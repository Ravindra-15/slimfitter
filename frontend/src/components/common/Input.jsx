// src/components/common/Input.jsx
import React from "react";

const Input = ({
  type = "text",
  label,
  placeholder,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-[#374151]"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-[#D6D1EC] rounded-xl px-4 py-3 text-sm text-[#374151] placeholder-gray-400 outline-none focus:border-[#4E4391] focus:ring-1 focus:ring-[#4E4391] transition-colors"
      />
    </div>
  );
};

export default Input;