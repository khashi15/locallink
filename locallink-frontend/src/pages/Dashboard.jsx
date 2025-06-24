import React, { useEffect, useState } from "react";

function Dashboard({ token, userId }) {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: "", description: "" });

  const fetchServices = () => {
    fetch("http://localhost:4000/api/services", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        // Show only own services
        const own = data.filter(s => s.provider_user_id === userId);
        setServices(own);
      });
  };

  useEffect(() => {
    fetchServices();
  }, [token]);

  const createService = () => {
    fetch("http://localhost:4000/api/services", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newService),
    })
      .then(res => res.json())
      .then(() => {
        fetchServices();
        setNewService({ title: "", description: "" });
      });
  };

  return (
    <div>
      <h2>Service Provider Dashboard</h2>

      <h3>Create New Service</h3>
      <input
        placeholder="Title"
        value={newService.title}
        onChange={e => setNewService({ ...newService, title: e.target.value })}
      />
      <input
        placeholder="Description"
        value={newService.description}
        onChange={e => setNewService({ ...newService, description: e.target.value })}
      />
      <button onClick={createService}>Create</button>

      <h3>My Services</h3>
      {services.map(service => (
        <div key={service.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h4>{service.title}</h4>
          <p>{service.description}</p>
          {/* Add edit functionality if needed */}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
