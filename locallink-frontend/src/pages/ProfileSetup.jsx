import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSetup = ({ accessToken, onComplete }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔍 Check if profile already exists
    axios
      .get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ Token in header
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

    axios
      .post(
        "http://localhost:3001/api/profile",
        { role, contactNumber, bio },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // ✅ Token in header
          },
        }
      )
      .then((res) => {
        console.log("✅ Profile saved:", res.data);
        alert("Profile saved successfully!");
        if (onComplete) {
          onComplete();
        } else {
          navigate("/"); // fallback if onComplete is not passed
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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl mb-4 font-bold">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Role</label>
          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="customer">Customer</option>
            <option value="service_provider">Service Provider</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Contact Number</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            className="w-full border p-2 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
