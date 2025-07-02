import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";

function MyServices({ accessToken }) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: "", description: "" });

  const fetchMyServices = () => {
    fetch("http://localhost:3001/api/services/my", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchMyServices();
  }, [accessToken]);

  const handleCreate = () => {
    if (!newService.title || !newService.description) return;
    fetch("http://localhost:3001/api/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newService),
    })
      .then((res) => res.json())
      .then(() => {
        setNewService({ title: "", description: "" });
        fetchMyServices();
      })
      .catch(console.error);
  };

  const handleUpdate = (id, updated) => {
    fetch(`http://localhost:3001/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then(fetchMyServices)
      .catch(console.error);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
        My Services
      </h2>

      {/* Create Service Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">
          Create New Service
        </h3>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded mr-2"
          value={newService.title}
          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded mr-2"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full text-white"
        >
          Create
        </button>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-400 italic">No services created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isOwner={true}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyServices;