import React, { useEffect, useState } from "react";

function Services({ token }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h2>All Services</h2>
      {services.map(service => (
        <div key={service.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Services;
