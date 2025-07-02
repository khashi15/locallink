import React, { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";

function Services({ accessToken }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/services", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(console.error);
  }, [accessToken]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400">
        All Services
      </h2>

      {services.length === 0 ? (
        <p className="text-gray-400 italic">No services available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;
