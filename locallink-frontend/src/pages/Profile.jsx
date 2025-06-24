import React from "react";

function Profile({ userInfo }) {
  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Email:</strong> {userInfo.email}</p>
      <p><strong>First Name:</strong> {userInfo.givenName}</p>
      <p><strong>Last Name:</strong> {userInfo.familyName}</p>
    </div>
  );
}

export default Profile;
