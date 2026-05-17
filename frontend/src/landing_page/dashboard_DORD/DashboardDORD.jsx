// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function DashboardDORD() {
//   const [projects, setProjects] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
//     const underReview = storedProjects.filter(
//       (p) => p.status === "Under Review" || p.status?.includes("R&D"),
//     );
//     setProjects(underReview);
//   }, []);

//   const updateStatus = (projectId, action) => {
//     const stored = JSON.parse(localStorage.getItem("projects")) || [];
//     const updated = stored.map((p) => {
//       if (p.projectId === projectId) {
//         let newStatus =
//           action === "approve" ? "Approved by DORD" : "Rejected by DORD";

//         // Combine logic if R&D already acted
//         if (p.status === "Approved by R&D" && action === "approve")
//           newStatus = "Fully Approved";
//         if (p.status === "Rejected by R&D" && action === "reject")
//           newStatus = "Fully Rejected";

//         return { ...p, status: newStatus };
//       }
//       return p;
//     });

//     localStorage.setItem("projects", JSON.stringify(updated));
//     setProjects(
//       updated.filter(
//         (p) => p.status === "Under Review" || p.status?.includes("R&D"),
//       ),
//     );
//   };

//   return (
//     <div className="container mt-5 mb-5">
//       <div className="card shadow p-4">
//         <h4 className="text-primary mb-4 text-center">DORD Dashboard</h4>

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
//                               ? "bg-success"
//                               : "bg-secondary"
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

// export default DashboardDORD;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function DashboardDORD() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch pending DORD projects
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch("/project/DORD", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();

//         if (!Array.isArray(data)) {
//           console.error("Expected array, got:", data);
//           setProjects([]);
//           return;
//         }

//         setProjects(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   if (loading) return <p className="p-10">Loading...</p>;

//  return (
//   <div className="min-h-screen bg-gray-100 p-10">
//     <h1 className="text-4xl font-bold mb-8 text-gray-800">
//       RND Dashboard
//     </h1>

//     {projects.length === 0 ? (
//       <p className="text-gray-600">No pending projects</p>
//     ) : (
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {projects.map((p) => (
//           <div
//             key={p._id}
//             className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6"
//           >
//             <h2 className="text-xl font-semibold text-gray-800 mb-1">
//               {p.title}
//             </h2>

//             <p className="text-sm text-gray-500 mb-2">
//               Code: <span className="font-medium">{p.projectCode}</span>
//             </p>

//             <span className="inline-block px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 mb-4">
//               {p.status.replaceAll("_", " ").toUpperCase()}
//             </span>

//             <div className="mt-4">
//               <button
//                 onClick={() =>
//                   navigate(`/summary?project=${p._id}`)
//                 }
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 View Summary
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>
// );

// }

// -------------Updated DORD dashboard---------------

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function DashboardDORD() {
//   const [projects, setProjects] = useState([]);
//   const navigate = useNavigate();

//   const getProjects = () => JSON.parse(localStorage.getItem("projects")) || [];

//   // 🔥 Map backend status → UI status
//   const getDisplayStatus = (status) => {
//     if (status?.includes("DORD")) {
//       if (status.includes("Approved")) return "Approved";
//       if (status.includes("Rejected")) return "Rejected";
//     }
//     return "Pending";
//   };

//   // 🔥 Filter only valid projects for DORD
//   const filterDORDProjects = (data) => {
//     return data.filter(
//       (p) =>
//         p.status === "Approved by R&D" ||
//         p.status === "Pending DORD Approval" ||
//         p.status?.includes("DORD"),
//     );
//   };

//   useEffect(() => {
//     const storedProjects = getProjects();
//     setProjects(filterDORDProjects(storedProjects));
//   }, []);

//   const updateStatus = (projectId, action) => {
//     if (!window.confirm("Are you sure?")) return;

//     const stored = getProjects();

//     const updated = stored.map((p) => {
//       if (p.projectId === projectId) {
//         let newStatus =
//           action === "approve" ? "Approved by DORD" : "Rejected by DORD";

//         // Keep backend logic intact
//         if (p.status === "Approved by R&D" && action === "approve")
//           newStatus = "Fully Approved";

//         if (p.status === "Rejected by R&D" && action === "reject")
//           newStatus = "Fully Rejected";

//         return { ...p, status: newStatus };
//       }
//       return p;
//     });

//     localStorage.setItem("projects", JSON.stringify(updated));
//     setProjects(filterDORDProjects(updated));
//   };

//   const getStatusColor = (status) => {
//     if (status === "Approved") return "bg-green-500";
//     if (status === "Rejected") return "bg-red-500";
//     return "bg-yellow-500"; // Pending
//   };

//   return (
//     <div className="p-6">
//       <div className="shadow-lg rounded-xl p-6 bg-white">
//         <h2 className="text-xl font-semibold text-center mb-6">
//           DORD Dashboard
//         </h2>

//         {projects.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No projects pending approval
//           </p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2">Project ID</th>
//                   <th className="p-2">Title</th>
//                   <th className="p-2">PI Name</th>
//                   <th className="p-2">Total Fund</th>
//                   <th className="p-2">Status</th>
//                   <th className="p-2">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {projects.map((p) => {
//                   const displayStatus = getDisplayStatus(p.status);
//                   const isFinal =
//                     displayStatus === "Approved" ||
//                     displayStatus === "Rejected";

//                   return (
//                     <tr key={p.projectId} className="text-center border-t">
//                       <td className="p-2">{p.projectId}</td>
//                       <td className="p-2">{p.title}</td>
//                       <td className="p-2">{p.piName}</td>
//                       <td className="p-2">
//                         ₹{Number(p.totalFund).toLocaleString()}
//                       </td>

//                       <td className="p-2">
//                         <span
//                           className={`text-white px-2 py-1 rounded text-xs ${getStatusColor(
//                             displayStatus,
//                           )}`}
//                         >
//                           {displayStatus}
//                         </span>
//                       </td>

//                       <td className="p-2 space-x-2">
//                         <button
//                           className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
//                           onClick={() =>
//                             navigate(`/summary?project=${p.projectId}`)
//                           }
//                         >
//                           View
//                         </button>

//                         <button
//                           disabled={isFinal}
//                           className={`px-2 py-1 rounded text-sm ${
//                             isFinal ? "bg-gray-300" : "bg-green-500 text-white"
//                           }`}
//                           onClick={() => updateStatus(p.projectId, "approve")}
//                         >
//                           Approve
//                         </button>

//                         <button
//                           disabled={isFinal}
//                           className={`px-2 py-1 rounded text-sm ${
//                             isFinal ? "bg-gray-300" : "bg-red-500 text-white"
//                           }`}
//                           onClick={() => updateStatus(p.projectId, "reject")}
//                         >
//                           Reject
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DashboardDORD;

//--------------------DORD dashboard with (Dummy data)-----------------------

import { useState } from "react";

function DashboardDORDPreview() {
  const [projects, setProjects] = useState([
    {
      projectId: "CSE-101",
      title: "AI Research",
      piName: "Dr. Sharma",
      totalFund: 500000,
      status: "Approved by R&D", // Pending
    },
    {
      projectId: "ECE-202",
      title: "IoT System",
      piName: "Dr. Verma",
      totalFund: 300000,
      status: "Pending DORD Approval", // Pending
    },
    {
      projectId: "MECH-303",
      title: "Robotics Lab",
      piName: "Dr. Singh",
      totalFund: 800000,
      status: "Approved by DORD", // Approved
    },
    {
      projectId: "CIVIL-404",
      title: "Bridge Design",
      piName: "Dr. Patel",
      totalFund: 600000,
      status: "Rejected by DORD", // Rejected
    },
    {
      projectId: "ELEC-505",
      title: "Smart Grid",
      piName: "Dr. Rao",
      totalFund: 750000,
      status: "Fully Approved", // Approved
    },
    {
      projectId: "CSE-106",
      title: "Machine Learning Optimization",
      piName: "Dr. Mehta",
      totalFund: 450000,
      status: "Approved by R&D",
    },
    {
      projectId: "ECE-207",
      title: "Wireless Sensor Networks",
      piName: "Dr. Iyer",
      totalFund: 320000,
      status: "Pending DORD Approval",
    },
    {
      projectId: "MECH-308",
      title: "Thermal Engineering Study",
      piName: "Dr. Khan",
      totalFund: 700000,
      status: "Approved by DORD",
    },
    {
      projectId: "CIVIL-409",
      title: "Urban Infrastructure Design",
      piName: "Dr. Gupta",
      totalFund: 650000,
      status: "Rejected by DORD",
    },
    {
      projectId: "ELEC-510",
      title: "Power Electronics Lab",
      piName: "Dr. Nair",
      totalFund: 550000,
      status: "Fully Approved",
    },
    {
      projectId: "CSE-611",
      title: "Blockchain Security",
      piName: "Dr. Roy",
      totalFund: 480000,
      status: "Approved by R&D",
    },
    {
      projectId: "ECE-712",
      title: "Embedded Systems Design",
      piName: "Dr. Thomas",
      totalFund: 360000,
      status: "Pending DORD Approval",
    },
    {
      projectId: "MECH-813",
      title: "Automobile Innovation",
      piName: "Dr. Bansal",
      totalFund: 820000,
      status: "Approved by DORD",
    },
    {
      projectId: "CIVIL-914",
      title: "Earthquake Resistant Structures",
      piName: "Dr. Reddy",
      totalFund: 900000,
      status: "Fully Approved",
    },
    {
      projectId: "ELEC-1015",
      title: "Renewable Energy Systems",
      piName: "Dr. Chatterjee",
      totalFund: 770000,
      status: "Pending DORD Approval",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // 🔥 Map backend → UI
  const getDisplayStatus = (status) => {
    if (status?.includes("DORD")) {
      if (status.includes("Approved")) return "Approved";
      if (status.includes("Rejected")) return "Rejected";
    }
    return "Pending";
  };

  const updateStatus = (projectId, action) => {
    if (!window.confirm("Are you sure?")) return;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.projectId === projectId) {
          let newStatus =
            action === "approve" ? "Approved by DORD" : "Rejected by DORD";

          if (p.status === "Approved by R&D" && action === "approve")
            newStatus = "Fully Approved";

          return { ...p, status: newStatus };
        }
        return p;
      }),
    );
  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "bg-green-500";
    if (status === "Rejected") return "bg-red-500";
    return "bg-yellow-500"; // Pending
  };

  const filteredProjects = projects.filter((p) => {
    const displayStatus = getDisplayStatus(p.status);

    const matchSearch =
      p.projectId.toLowerCase().includes(search.toLowerCase()) ||
      p.piName.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "All" ? true : displayStatus === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">DORD Dashboard (Preview)</h2>
        <p className="text-gray-500 text-sm">
          Total Projects: {filteredProjects.length}
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Project ID or PI"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full sm:w-1/3"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg cursor-pointer"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Project ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">PI Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((p) => {
              const displayStatus = getDisplayStatus(p.status);
              const isFinal =
                displayStatus === "Approved" || displayStatus === "Rejected";

              return (
                <tr key={p.projectId} className="text-center border-t">
                  <td className="p-2">{p.projectId}</td>
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">{p.piName}</td>
                  <td className="p-2">
                    ₹{Number(p.totalFund).toLocaleString()}
                  </td>

                  <td className="p-2">
                    <span
                      className={`text-white px-2 py-1 rounded text-xs ${getStatusColor(
                        displayStatus,
                      )}`}
                    >
                      {displayStatus}
                    </span>
                  </td>

                  <td className="p-2">
                    <div className="flex flex-wrap gap-1 justify-center">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer">
                      View
                    </button>

                    <button
                      disabled={isFinal}
                      onClick={() => updateStatus(p.projectId, "approve")}
                      className={`px-2 py-1 rounded text-xs ${
                        isFinal
                          ? "bg-gray-300"
                          : "bg-green-500 text-white cursor-pointer"
                      }`}
                    >
                      Approve
                    </button>

                    <button
                      disabled={isFinal}
                      onClick={() => updateStatus(p.projectId, "reject")}
                      className={`px-2 py-1 rounded text-xs ${
                        isFinal
                          ? "bg-gray-300"
                          : "bg-red-500 text-white cursor-pointer"
                      }`}
                    >
                      Reject
                    </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardDORDPreview;
