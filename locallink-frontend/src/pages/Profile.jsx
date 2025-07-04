import React, { useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function Profile({ userInfo, roles }) {
  const { getAccessToken } = useAuthContext();

  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [contactNumber, setContactNumber] = useState(userInfo.contactNumber || "");
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
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          contactNumber,
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
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-10 mt-12">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
        My Profile
      </h2>

      <div className="space-y-6 text-gray-700 text-lg">
        <p>
          <span className="font-semibold text-gray-900">Username:</span>{" "}
          {userInfo.username || "N/A"}
        </p>

        <label className="block">
          <span className="font-semibold text-gray-900">First Name:</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-xl border border-gray-300 shadow-sm px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={saving}
          />
        </label>

        <label className="block">
          <span className="font-semibold text-gray-900">Last Name:</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-xl border border-gray-300 shadow-sm px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
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
            className="mt-1 block w-full rounded-xl border border-gray-300 shadow-sm px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
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
          className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {message && (
          <p className="mt-4 text-center font-medium text-lg">
            {message.startsWith("✅") ? (
              <span className="text-green-600">{message}</span>
            ) : (
              <span className="text-red-600">{message}</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
