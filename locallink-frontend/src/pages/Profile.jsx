import React from "react";

function Profile({ userInfo, roles }) {
  return (
    <div className="max-w-lg mx-auto bg-white text-black rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <p className="mb-2">
        <strong>User ID:</strong> {userInfo.userId || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Username:</strong> {userInfo.username || "N/A"}
      </p>
      <p className="mb-2">
        <strong>First Name:</strong> {userInfo.firstName || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Last Name:</strong> {userInfo.lastName || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Role:</strong> {roles?.join(", ") || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Country:</strong> {userInfo.country || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {userInfo.email || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Mobile Number:</strong> {userInfo.mobile || "N/A"}
      </p>
      <p className="mb-2">
        <strong>Birth Date:</strong> {userInfo.birthDate || "N/A"}
      </p>
    </div>
  );
}

export default Profile;
