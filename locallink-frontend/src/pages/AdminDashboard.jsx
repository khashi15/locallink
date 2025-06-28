import React, { useEffect, useState } from "react";

function AdminDashboard({ accessToken, userRoles }) {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!userRoles.includes("admin")) return;

    fetch("http://localhost:4000/api/users", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch("http://localhost:4000/api/services", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, [accessToken, userRoles]);

  if (!userRoles.includes("admin"))
    return <p className="text-red-600">Access Denied</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="bg-white text-black rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-4">All Registered Users</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-gray-100 p-3 rounded-md flex justify-between"
            >
              <span>{user.email}</span>
              <span className="font-semibold">{user.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white text-black rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold mb-4">All Services</h3>
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-gray-100 p-4 rounded-md mb-4"
          >
            <h4 className="text-lg font-bold">{service.title}</h4>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;