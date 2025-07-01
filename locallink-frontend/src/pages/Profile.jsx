import React from "react";

function Profile({ userInfo, roles }) {
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
        <p>
          <span className="font-semibold text-gray-900">First Name:</span>{" "}
          {userInfo.firstName || "N/A"}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Last Name:</span>{" "}
          {userInfo.lastName || "N/A"}
        </p>
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
        <p>
          <span className="font-semibold text-gray-900">Mobile Number:</span>{" "}
          {userInfo.mobile || "N/A"}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Birth Date:</span>{" "}
          {userInfo.birthDate || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default Profile;
