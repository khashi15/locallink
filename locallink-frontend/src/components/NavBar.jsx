import React from "react";
import { Link } from "react-router-dom";

export default function NavBar({ userRoles, signOut }) {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        <Link to="/services" className="hover:underline">
          Services
        </Link>
        {userRoles.includes("service_provider") && (
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        )}
        {userRoles.includes("admin") && (
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        )}
      </div>
      <button
        onClick={() => signOut()}
        className="bg-red-600 hover:bg-red-700 rounded px-3 py-1 font-semibold"
      >
        Logout
      </button>
    </nav>
  );
}
