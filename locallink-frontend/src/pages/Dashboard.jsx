import React, { useEffect, useState } from "react";
import Button from "../components/Button";

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
    if (!newService.title || !newService.description) {
      alert("Please fill in both title and description");
      return;
    }

    fetch("http://localhost:4000/api/services", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newService),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create service");
        return res.json();
      })
      .then(() => {
        fetchServices();
        setNewService({ title: "", description: "" });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Service Provider Dashboard
      </h2>

      <section className="bg-white rounded-xl shadow-lg p-8 mb-10">
        <h3 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-3">
          Create New Service
        </h3>
        <div className="space-y-5">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
            placeholder="Title"
            value={newService.title}
            onChange={(e) =>
              setNewService({ ...newService, title: e.target.value })
            }
          />
          <textarea
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition resize-none"
            placeholder="Description"
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
          />
          <Button onClick={createService} className="w-full text-lg">
            Create Service
          </Button>
        </div>
      </section>

      <h3 className="text-3xl font-semibold mb-6 text-white border-b border-gray-600 pb-2">
        My Services
      </h3>

      {services.length === 0 ? (
        <p className="text-gray-300 italic">No services created yet.</p>
      ) : (
        <div className="space-y-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h4>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
