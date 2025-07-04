import React, { useEffect, useState } from "react";

function AdminDashboard({ accessToken, userRoles }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!userRoles.includes("admin")) return;

    fetch("http://localhost:3001/api/admin/asgardeo-users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      });

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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-center">
        Admin Dashboard
      </h2>

      <section className="bg-gray-900 rounded-2xl shadow-2xl p-10 mb-16 text-gray-100">
        <h3 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">
          All Registered Users
        </h3>

        {users.length === 0 ? (
          <p className="text-gray-500 italic text-center">No users found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full table-auto border border-gray-700 text-sm">
              <thead>
                <tr className="bg-indigo-800 text-gray-200">
                  <th className="border border-gray-700 px-4 py-2">User ID</th>
                  <th className="border border-gray-700 px-4 py-2">Username</th>
                  <th className="border border-gray-700 px-4 py-2">Email</th>
                  <th className="border border-gray-700 px-4 py-2">First Name</th>
                  <th className="border border-gray-700 px-4 py-2">Last Name</th>
                  <th className="border border-gray-700 px-4 py-2">Roles</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-indigo-700 transition duration-150"
                  >
                    <td className="border border-gray-700 px-4 py-2">{user.id}</td>
                    <td className="border border-gray-700 px-4 py-2">{user.username}</td>
                    <td className="border border-gray-700 px-4 py-2">{user.email || "-"}</td>
                    <td className="border border-gray-700 px-4 py-2">{user.firstName || "-"}</td>
                    <td className="border border-gray-700 px-4 py-2">{user.lastName || "-"}</td>
                    <td className="border border-gray-700 px-4 py-2">
                      {user.roles.length > 0 ? user.roles.join(", ") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-gray-900 rounded-2xl shadow-2xl p-10 text-gray-100">
        <h3 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">
          All Services
        </h3>

        {services.length === 0 ? (
          <p className="text-gray-500 italic text-center">No services found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-indigo-900 p-5 rounded-lg shadow hover:shadow-lg transition border border-indigo-700"
              >
                <h4 className="text-xl font-bold text-indigo-300 mb-2">
                  {service.title}
                </h4>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
