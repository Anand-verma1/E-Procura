import { useState } from "react";
import RndCodeCreationForm from "./RndCodeCreationForm";

export default function RndDashboard() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              RND Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Initiate and manage project codes
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
            >
              + Create Project Code
            </button>
          )}
        </div>

        {/* Form Section */}
        {showForm && (
          <RndCodeCreationForm onClose={() => setShowForm(false)} />
        )}

      </div>
    </div>
  );
}
