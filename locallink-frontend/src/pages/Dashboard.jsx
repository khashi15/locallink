import React, { useEffect, useState } from "react";

function Dashboard({ accessToken, userId }) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: "", description: "" });

  const fetchServices = () => {
    fetch("http://localhost:4000/api/services", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const own = data.filter((s) => s.provider_user_id === userId);
        setServices(own);
      });
  };

  useEffect(() => {
    fetchServices();
  }, [accessToken]);

  const createService = () => {
    fetch("http://localhost:4000/api/services", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newService),
    })
      .then((res) => res.json())
      .then(() => {
        fetchServices();
        setNewService({ title: "", description: "" });
      });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Service Provider Dashboard</h2>

      <div className="bg-white text-black rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Service</h3>
        <div className="space-y-4">
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title"
            value={newService.title}
            onChange={(e) =>
              setNewService({ ...newService, title: e.target.value })
            }
          />
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
          />
          <button
            onClick={createService}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">My Services</h3>
      {services.length === 0 ? (
        <p className="text-gray-300">No services created yet.</p>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            className="bg-white text-black rounded-lg shadow-md p-4 mb-4"
          >
            <h4 className="text-lg font-bold">{service.title}</h4>
            <p>{service.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;