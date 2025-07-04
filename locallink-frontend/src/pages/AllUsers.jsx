import React, { useEffect, useState } from "react";

function AllUsers({ accessToken }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    fetch("http://localhost:3001/api/admin/asgardeo-users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [accessToken]);

  if (loading)
    return (
      <p className="p-6 text-lg text-gray-300 animate-pulse">
        Loading users...
      </p>
    );

  if (error)
    return (
      <p className="p-6 text-red-600 font-semibold">
        Error loading users: {error}
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-center">
        All Registered Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500 italic text-center">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-2xl bg-gray-900">
          <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm md:text-base text-gray-100">
            <thead>
              <tr className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-800 text-gray-200">
                <th className="border border-gray-700 px-4 py-3 text-left">User ID</th>
                <th className="border border-gray-700 px-4 py-3 text-left">Username</th>
                <th className="border border-gray-700 px-4 py-3 text-left">Email</th>
                <th className="border border-gray-700 px-4 py-3 text-left">First Name</th>
                <th className="border border-gray-700 px-4 py-3 text-left">Last Name</th>
                <th className="border border-gray-700 px-4 py-3 text-left">Roles</th>
                <th className="border border-gray-700 px-4 py-3 text-left">Phone</th>
                <th className="border border-gray-700 px-4 py-3 text-left">Country</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id || user.userId}
                  className="hover:bg-indigo-700 transition duration-150"
                >
                  <td className="border border-gray-700 px-4 py-2">
                    {user.id || user.userId}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {user.username || "-"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {user.email || "-"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {user.firstName || "-"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {user.lastName || "-"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {user.roles && user.roles.length > 0
                      ? user.roles.join(", ")
                      : "-"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {user.phone || "-"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {user.country || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllUsers;
