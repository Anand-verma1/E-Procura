// export default function ProjectSelection({ onSelect }) {

//   // Dummy data (for demo)
//   const projects = [
//     {
//       projectCode: "2026/CSE/0001",
//       availableFunds: 500000,
//       transactionId: "TXN12345",
//       piName: "Dr. Sharma"
//     },
//     {
//       projectCode: "2026/CSE/0002",
//       availableFunds: 300000,
//       transactionId: "TXN67890",
//       piName: "Dr. Verma"
//     },
//     {
//       projectCode: "2026/CSE/0003",
//       availableFunds: 300000,
//       transactionId: "TXN67890",
//       piName: "Dr. Verma"
//     }
//   ];

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6">

//       <h2 className="text-xl font-semibold mb-6 text-gray-700">
//         Select Project Code
//       </h2>

//       <div className="space-y-4">
//         {projects.map((project, index) => (
//           <div
//             key={index}
//             className="border rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition"
//             onClick={() => onSelect(project)}
//           >
//             <p className="font-semibold text-blue-600">
//               {project.projectCode}
//             </p>
//             <p className="text-sm text-gray-600">
//               Available Funds: ₹{project.availableFunds}
//             </p>
//             <p className="text-sm text-gray-600">
//               Transaction id : ₹{project.transactionId}
//             </p>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

import { useEffect, useState } from "react";

export default function PIProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">My Projects</h3>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="row">
          {projects.map((proj, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm p-3">
                <h5 className="text-dark">{proj.projectCode}</h5>

                <p className="mb-1">
                  <b>PI Name:</b> {proj.piName}
                </p>

                <p className="mb-1">
                  <b>Funds:</b> ₹{proj.availableFunds}
                </p>

                <p className="mb-2">
                  <b>Transaction ID:</b> {proj.transactionId}
                </p>

                <button className="btn btn-outline-primary btn-sm">
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
