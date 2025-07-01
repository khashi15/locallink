import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ProfileSetup = ({ accessToken, onComplete }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        navigate("/");
      })
      .catch(() => {
        setLoading(false);
      });
  }, [accessToken, navigate]);

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
      .then((res) => {
        alert("Profile saved successfully!");
        if (onComplete) onComplete();
        else navigate("/");
      })
      .catch(() => {
        alert("Error saving profile. Please try again.");
      });
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white px-4">
      <div className="bg-gray-900 bg-opacity-80 p-10 rounded-3xl shadow-xl w-full max-w-md backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block mb-3 text-lg font-semibold">
              Select Your Role
            </label>
            <select
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-600 transition text-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" className="text-gray-500">
                -- Select Role --
              </option>
              <option value="customer">Customer</option>
              <option value="service_provider">Service Provider</option>
            </select>
            {error && (
              <p className="mt-2 text-red-400 font-semibold">{error}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-lg">
            Save and Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
