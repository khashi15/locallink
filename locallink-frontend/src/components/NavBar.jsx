import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function NavBar({ userRoles, signOut }) {
  return (
    <nav className="bg-gray-900/90 backdrop-blur-md text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 shadow-lg border-b border-gray-700">
      <div className="space-x-8 text-lg font-medium flex flex-wrap">
        <Link to="/" className="hover:text-blue-400 transition">
          Home
        </Link>
        <Link to="/profile" className="hover:text-blue-400 transition">
          Profile
        </Link>
        <Link to="/services" className="hover:text-blue-400 transition">
          Services
        </Link>
        {userRoles.includes("service_provider") && (
          <Link to="/dashboard" className="hover:text-blue-400 transition">
            Dashboard
          </Link>
        )}
        {userRoles.includes("admin") && (
          <Link to="/admin" className="hover:text-blue-400 transition">
            Admin
          </Link>
        )}
      </div>

      <div className="mt-4 md:mt-0">
        <Button
          onClick={signOut}
          className="bg-red-600 hover:bg-red-700 shadow-md"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
