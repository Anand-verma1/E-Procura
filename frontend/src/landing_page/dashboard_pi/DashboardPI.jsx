// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function DashboardPI() {
//   const navigate = useNavigate();

//   const [projects, setProjects] = useState([]);
//   const [searchCode, setSearchCode] = useState("");
//   const [searchedProject, setSearchedProject] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   // 🔹 Fetch PI projects
// useEffect(() => {
//   const fetchProjects = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch("http://localhost:5000/project/pi", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch projects");
//       }

//       const data = await res.json();
//       setProjects(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchProjects();
// }, []);


//   // 🔍 Search by project code (client side)
//   const handleSearch = () => {
//     if (!searchCode) return;

//     const project = projects.find(
//       (p) => p.projectId === searchCode
//     );

//     if (!project) {
//       alert("Project not found");
//       setSearchedProject(null);
//     } else {
//       setSearchedProject(project);
//     }
//   };

//   // 🏷 Status badge color
//   const statusColor = (status) => {
//     switch (status) {
//       case "pending_rnd":
//         return "text-yellow-400";
//       case "pending_dean":
//         return "text-blue-400";
//       case "approved":
//         return "text-green-400";
//       case "rejected_by_rnd":
//       case "rejected_by_dean":
//         return "text-red-400";
//       default:
//         return "text-gray-300";
//     }
//   };

//   return (
//     <div className="dashboard-bg fade-in text-[#eff6e0] p-10">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-10">
//         <h1 className="text-4xl font-bold tracking-wide">
//           PI Dashboard
//         </h1>

//         <button
//           className="btn-primary"
//           onClick={() => navigate("/new-project")}
//         >
//           + New Project
//         </button>
//       </div>

//       {/* SEARCH */}
//       <div className="glass-card p-7 mb-12">
//         <h2 className="text-xl font-semibold mb-4">
//           Search Project by Code
//         </h2>

//         <div className="flex gap-4">
//           <input
//             type="text"
//             placeholder="Enter Project Code"
//             value={searchCode}
//             onChange={(e) => setSearchCode(e.target.value)}
//             className="flex-1 p-3 rounded-xl text-black outline-none"
//           />

//           <button onClick={handleSearch} className="btn-primary">
//             Search
//           </button>
//         </div>

//         {/* SEARCH RESULT */}
//         {searchedProject && (
//           <div className="glass-card p-6 mt-6 fade-in">
//             <h3 className="text-lg font-semibold">
//               {searchedProject.title}
//             </h3>

//             <p className="text-sm opacity-80 mb-4">
//               {searchedProject.projectId} ·{" "}
//               <span className={statusColor(searchedProject.status)}>
//                 {searchedProject.status}
//               </span>
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() =>
//                   navigate(`/summary?project=${searchedProject._id}`)
//                 }
//                 className="border border-[#aec3b0] px-4 py-2 rounded-lg hover:bg-[#aec3b0] hover:text-black transition"
//               >
//                 View Summary
//               </button>

//               {searchedProject.status === "approved" && (
//                 <button
//                   onClick={() =>
//                     navigate(`/fund-booking/${searchedProject._id}`)
//                   }
//                   className="btn-primary"
//                 >
//                   Fund Booking
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* PROJECT LIST */}
//       <h2 className="text-2xl font-semibold mb-6">
//         My Projects
//       </h2>

//       {projects.length === 0 ? (
//         <p className="opacity-70">No projects available</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {projects.map((proj) => (
//             <div key={proj._id} className="glass-card p-6">
//               <h3 className="text-lg font-semibold">
//                 {proj.title}
//               </h3>

//               <p className="text-sm opacity-70 mb-4">
//                 {proj.projectId} ·{" "}
//                 <span className={statusColor(proj.status)}>
//                   {proj.status}
//                 </span>
//               </p>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() =>
//                     navigate(`/summary?project=${proj._id}`)
//                   }
//                   className="border border-[#aec3b0] px-4 py-2 rounded-lg hover:bg-[#aec3b0] hover:text-black transition"
//                 >
//                   View Summary
//                 </button>

//                 {proj.status === "approved" && (
//                   <button
//                     onClick={() =>
//                     navigate(`/fund-booking/${proj._id}`)
//                     }
//                     className="btn-primary"
//                   >
//                     Fund Booking
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );}
import { useState } from "react";
import ProjectSelection from "./ProjectSelection";
import DivisionForm from "../project_division_form/ProjectDivisionForm"

export default function PiDashboard() {
  const [showProjects, setShowProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              PI Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your assigned projects
            </p>
          </div>

          {!selectedProject && (
            <button
              onClick={() => setShowProjects(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
            >
              + New Project
            </button>
          )}
        </div>

        {/* Project List */}
        {showProjects && !selectedProject && (
          <ProjectSelection onSelect={setSelectedProject} />
        )}
        {/* Division Form */}
        {selectedProject && (
          <DivisionForm
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </div>
  );
}