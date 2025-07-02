import React, { useEffect, useState } from "react";

function AdminDashboard({ accessToken, userRoles }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!userRoles.includes("admin")) return;

    // Fetch users from backend (mapped fields)
    fetch("http://localhost:3001/api/admin/asgardeo-users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      });

    // Fetch services
    fetch("http://localhost:3001/api/services", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => {
        console.error("Failed to fetch services:", err);
        setServices([]);
      });
  }, [accessToken, userRoles]);

  if (!userRoles.includes("admin"))
    return (
      <p className="text-red-600 font-semibold p-6 text-center text-lg">
        Access Denied
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Admin Dashboard
      </h2>

      {/* Users Section */}
      <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h3 className="text-3xl font-semibold mb-6 border-b border-gray-200 pb-2">
          All Registered Users (from Asgardeo)
        </h3>

        {users.length === 0 ? (
          <p className="text-gray-500 italic">No users found.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border border-gray-300 px-4 py-2 text-left">User ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Roles</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50 transition">
                  <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.firstName || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.lastName || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.roles.length > 0 ? user.roles.join(", ") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Services Section */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-3xl font-semibold mb-6 border-b border-gray-200 pb-2">
          All Services
        </h3>
        {services.length === 0 ? (
          <p className="text-gray-500 italic">No services found.</p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-indigo-50 p-5 rounded-lg mb-5 shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-xl font-bold text-indigo-700 mb-1">
                {service.title}
              </h4>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;