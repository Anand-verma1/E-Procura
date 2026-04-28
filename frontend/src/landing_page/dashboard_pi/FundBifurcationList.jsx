import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FundBifurcationList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <p className="text-center mt-5">Loading....</p>;
  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">My Projects</h3>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((proj, index) => (
           <div key={index}>
  <div className="bg-white border border-gray-200 rounded-none p-4 shadow-sm hover:shadow-md transition duration-300">

    {/* Project Code */}
    <h5 className="text-lg font-semibold text-gray-800 mb-2">
      {proj.projectCode}
    </h5>

    {/* PI Name */}
    <p className="text-sm text-gray-600">
      <span className="font-medium text-gray-700">PI:</span> {proj.piName}
    </p>

    {/* Funds */}
    <p className="text-sm text-gray-600 mt-1">
      <span className="font-medium text-gray-700">Funds:</span> ₹{proj.totalFundReceived}
    </p>

    {/* Transaction */}
    <p className="text-sm text-gray-600 mt-1 mb-3">
      <span className="font-medium text-gray-700">Txn ID:</span> {proj.bankTransactionId}
    </p>

    {/* Button */}
    <button onClick={() => navigate(`/projects/${proj._id}`)} className="w-full border border-blue-500 text-blue-500 text-sm py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition">
      View Details
    </button>

  </div>
</div>
          ))}
        </div>
      )}
    </div>
  );
}
