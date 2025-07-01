import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-transform duration-200 shadow-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
