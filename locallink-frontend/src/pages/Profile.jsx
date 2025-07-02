import React, { useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function Profile({ userInfo, roles }) {
  const { getAccessToken } = useAuthContext();

  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [mobileNumber, setMobileNumber] = useState(userInfo.mobile || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const accessToken = await getAccessToken();

      const response = await fetch("http://localhost:3001/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Access token for backend validation
        },
        body: JSON.stringify({
          firstName,
          lastName,
          contactNumber: mobileNumber, // backend expects contactNumber key
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage("❌ Error updating profile: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8 mt-12">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
        My Profile
      </h2>

      <div className="space-y-4 text-gray-700 text-lg">
        <p>
          <span className="font-semibold text-gray-900">User ID:</span>{" "}
          {userInfo.userId || "N/A"}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Username:</span>{" "}
          {userInfo.username || "N/A"}
        </p>

        <label className="block">
          <span className="font-semibold text-gray-900">First Name:</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={saving}
          />
        </label>

        <label className="block">
          <span className="font-semibold text-gray-900">Last Name:</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={saving}
          />
        </label>

        <p>
          <span className="font-semibold text-gray-900">Role:</span>{" "}
          {roles?.length ? roles.join(", ") : "N/A"}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Country:</span>{" "}
          {userInfo.country || "N/A"}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Email:</span>{" "}
          {userInfo.email || "N/A"}
        </p>

        <label className="block">
          <span className="font-semibold text-gray-900">Mobile Number:</span>
          <input
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            disabled={saving}
          />
        </label>

        <p>
          <span className="font-semibold text-gray-900">Birth Date:</span>{" "}
          {userInfo.birthDate || "N/A"}
        </p>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {message && <p className="mt-2 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default Profile;
