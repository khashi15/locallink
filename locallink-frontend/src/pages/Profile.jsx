import React from "react";

function Profile({ userInfo }) {
  return (
    <div className="max-w-lg mx-auto bg-white text-black rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <p className="mb-2">
        <strong>Email:</strong> {userInfo.email}
      </p>
      <p className="mb-2">
        <strong>First Name:</strong> {userInfo.givenName}
      </p>
      <p>
        <strong>Last Name:</strong> {userInfo.familyName}
      </p>
    </div>
  );
}

export default Profile;
