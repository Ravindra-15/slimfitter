// src/components/common/Button.jsx
import React from "react";

const Button = ({ text, onClick, disabled, fullWidth = true, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#4E4391] hover:bg- [#4E4391] text-white py-3.5 rounded-full text-base font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        fullWidth ? "w-full px-5" : "px-8"
      }`}
    >
      {text}
    </button>
  );
};

export default Button;