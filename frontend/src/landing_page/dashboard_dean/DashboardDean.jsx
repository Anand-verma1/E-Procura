// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function DashboardDean() {
//   const [projects, setProjects] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
//     const underReview = storedProjects.filter(
//       (p) => p.status === "Under Review" || p.status?.includes("R&D")
//     );
//     setProjects(underReview);
//   }, []);

//   const updateStatus = (projectId, action) => {
//     const stored = JSON.parse(localStorage.getItem("projects")) || [];
//     const updated = stored.map((p) => {
//       if (p.projectId === projectId) {
//         let newStatus = action === "approve" ? "Approved by Dean" : "Rejected by Dean";

//         // Combine logic if R&D already acted
//         if (p.status === "Approved by R&D" && action === "approve") newStatus = "Fully Approved";
//         if (p.status === "Rejected by R&D" && action === "reject") newStatus = "Fully Rejected";

//         return { ...p, status: newStatus };
//       }
//       return p;
//     });

//     localStorage.setItem("projects", JSON.stringify(updated));
//     setProjects(updated.filter((p) => p.status === "Under Review" || p.status?.includes("R&D")));
//   };

//   return (
//     <div className="container mt-5 mb-5">
//       <div className="card shadow p-4">
//         <h4 className="text-primary mb-4 text-center">Dean Dashboard</h4>

//         {projects.length === 0 ? (
//           <div className="alert alert-info text-center">
//             No projects under review.
//           </div>
//         ) : (
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th>Project ID</th>
//                   <th>Title</th>
//                   <th>PI Name</th>
//                   <th>Total Fund</th>
//                   <th>Current Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.map((p) => (
//                   <tr key={p.projectId}>
//                     <td>{p.projectId}</td>
//                     <td>{p.title}</td>
//                     <td>{p.piName}</td>
//                     <td>{p.totalFund}</td>
//                     <td>
//                       <span
//                         className={`badge ${
//                           p.status.includes("Reject")
//                             ? "bg-danger"
//                             : p.status.includes("Approve")
//                             ? "bg-success"
//                             : "bg-secondary"
//                         }`}
//                       >
//                         {p.status}
//                       </span>
//                     </td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-outline-primary me-2"
//                         onClick={() =>
//                           navigate(`/summary?project=${p.projectId}`)
//                         }
//                       >
//                         View
//                       </button>
//                       <button
//                         className="btn btn-sm btn-success me-2"
//                         onClick={() => updateStatus(p.projectId, "approve")}
//                       >
//                         Approve
//                       </button>
//                       <button
//                         className="btn btn-sm btn-danger"
//                         onClick={() => updateStatus(p.projectId, "reject")}
//                       >
//                         Reject
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DashboardDean;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardDean() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch pending dean projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/project/dean", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          setProjects([]);
          return;
        }

        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  if (loading) return <p className="p-10">Loading...</p>;

 return (
  <div className="min-h-screen bg-gray-100 p-10">
    <h1 className="text-4xl font-bold mb-8 text-gray-800">
      RND Dashboard
    </h1>

    {projects.length === 0 ? (
      <p className="text-gray-600">No pending projects</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {p.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              Code: <span className="font-medium">{p.projectCode}</span>
            </p>

            <span className="inline-block px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 mb-4">
              {p.status.replaceAll("_", " ").toUpperCase()}
            </span>

            <div className="mt-4">
              <button
                onClick={() =>
                  navigate(`/summary?project=${p._id}`)
                }
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Summary
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

}
