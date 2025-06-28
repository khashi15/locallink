import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSetup = ({ accessToken, onComplete }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔍 Check if profile already exists
    axios
      .get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log("✅ Profile exists:", res.data);
        navigate("/"); // ✅ Profile exists — go home
      })
      .catch((err) => {
        console.log("⚠️ Profile not found — proceed to setup");
        setLoading(false); // ✅ Show form
      });
  }, [accessToken, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
        console.log("✅ Profile saved:", res.data);
        alert("Profile saved successfully!");
        if (onComplete) {
          onComplete();
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("❌ Error saving profile:", err);
        alert("Error saving profile. Check console for details.");
      });
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Complete Your Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Select Your Role
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="customer">Customer</option>
              <option value="service_provider">Service Provider</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
