import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";

const ProfileSetup = ({ accessToken, onComplete }) => {
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role.");
      return;
    }

    axios
      .post(
        "http://localhost:3001/api/profile",
        { role },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        alert("Role assigned successfully! Please login again.");
        if (onComplete) {
          onComplete();  // Navigation happens in App.jsx
        }
      })
      .catch(() => {
        alert("Error assigning role. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white px-4">
      <div className="bg-gray-900 bg-opacity-80 p-10 rounded-3xl shadow-xl w-full max-w-md backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
          Select Your Role
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-3 text-lg font-semibold">
              Choose Role
            </label>
            <select
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-600 transition text-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="customer">Customer</option>
              <option value="service_provider">Service Provider</option>
            </select>
            {error && (
              <p className="mt-2 text-red-400 font-semibold">{error}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-lg">
            Save Role
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
