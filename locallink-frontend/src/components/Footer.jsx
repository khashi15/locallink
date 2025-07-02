import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-6 border-t border-gray-700">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} <span className="text-white font-semibold">LocalLink</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;