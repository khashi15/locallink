import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ({ children, userRoles, signOut }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <NavBar userRoles={userRoles} signOut={signOut} />
      <main className="flex-grow p-6 md:p-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
