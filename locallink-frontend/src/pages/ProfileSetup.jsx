import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";

const ProfileSetup = ({ accessToken, onComplete }) => {
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3001/api/profile",
        { role },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Role assigned successfully! Please login again.");
      if (onComplete) {
        onComplete(); // Navigation happens in App.jsx
      }
    } catch {
      alert("Error assigning role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white px-4">
      <div className="bg-gray-900 bg-opacity-90 p-10 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-md border border-purple-700">
        <h1 className="text-4xl font-extrabold mb-10 text-center tracking-widest drop-shadow-lg">
          Select Your Role
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-3 text-lg font-semibold">
              Choose Role
            </label>
            <select
              className="w-full p-4 rounded-xl bg-gray-800 border border-purple-700 text-white text-lg focus:outline-none focus:ring-4 focus:ring-purple-500 transition shadow-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Select Role --</option>
              <option value="customer">Customer</option>
              <option value="service_provider">Service Provider</option>
            </select>
            {error && (
              <p className="mt-2 text-red-400 font-semibold text-center">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 transition shadow-lg"
          >
            {loading ? "Saving..." : "Save Role"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
