import React, { useEffect, useState } from "react";

function Services({ accessToken }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/services", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(console.error);
  }, [accessToken]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">All Services</h2>
      {services.length === 0 ? (
        <p className="text-gray-300">No services available.</p>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            className="bg-white text-black rounded-lg shadow-md p-4 mb-4"
          >
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Services;
