import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 hover:scale-105 active:scale-95 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
