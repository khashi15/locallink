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
    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition duration-300 ease-in-out">
      {editing ? (
        <div>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={edited.title}
            onChange={(e) => setEdited({ ...edited, title: e.target.value })}
            placeholder="Service Title"
          />
          <textarea
            className="border border-gray-300 rounded-lg p-3 mb-4 w-full resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="4"
            value={edited.description}
            onChange={(e) =>
              setEdited({ ...edited, description: e.target.value })
            }
            placeholder="Service Description"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow-md transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-5 py-2 rounded-full shadow-md transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 mb-4">
            {service.title}
          </h3>
          <p className="text-gray-700 mb-5 whitespace-pre-line">{service.description}</p>

          {isOwner && (
            <div className="flex gap-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2 rounded-full text-white shadow-md hover:from-purple-600 hover:to-pink-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full text-white shadow-md transition"
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
