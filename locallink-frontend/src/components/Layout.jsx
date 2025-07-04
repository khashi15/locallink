import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Layout = ({ children, userRoles, signOut }) => {
  const isAdmin = userRoles.includes("admin");
  const isServiceProvider = userRoles.includes("service_provider");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="bg-gray-950 shadow-md sticky top-0 z-50">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex space-x-8 font-semibold text-lg">
            <Link
              to="/"
              className="font-bold text-white hover:text-pink-400 transition"
            >
              LocalLink
            </Link>
            <Link to="/services" className="hover:text-pink-400 transition">
              All Services
            </Link>
            {isServiceProvider && (
              <Link to="/my-services" className="hover:text-pink-400 transition">
                My Services
              </Link>
            )}
            {isAdmin && (
              <>
                <Link to="/admin" className="hover:text-pink-400 transition">
                  Admin
                </Link>
                <Link to="/all-users" className="hover:text-pink-400 transition">
                  All Users
                </Link>
              </>
            )}
            <Link to="/profile" className="hover:text-pink-400 transition">
              Profile
            </Link>
          </div>
          <button
            onClick={signOut}
            className="bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2 rounded-full text-white font-semibold hover:opacity-90 transition shadow-md focus:outline-none focus:ring-4 focus:ring-pink-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="flex-grow p-6 md:p-10">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
