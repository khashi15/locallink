import React from "react";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default Layout;