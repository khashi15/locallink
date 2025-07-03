import React, { useState } from "react";

function ServiceCard({ service, isOwner = false, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [edited, setEdited] = useState({
    title: service.title,
    description: service.description,
  });

  const handleSave = () => {
    onUpdate(service.id, edited);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
      {editing ? (
        <div>
          <input
            type="text"
            className="border p-2 rounded mb-2 w-full"
            value={edited.title}
            onChange={(e) => setEdited({ ...edited, title: e.target.value })}
          />
          <textarea
            className="border p-2 rounded mb-2 w-full"
            rows="3"
            value={edited.description}
            onChange={(e) => setEdited({ ...edited, description: e.target.value })}
          />
          <div className="space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-1 rounded-full"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-black px-4 py-1 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
          <p className="text-gray-700 mb-3">{service.description}</p>

          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-1 rounded-full text-white"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="bg-red-600 px-4 py-1 rounded-full text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ServiceCard;
