import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardPI() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchedProject, setSearchedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔹 Fetch PI projects
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/projects/bifurcated", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await res.json();
      console.log("bifurcation checking",data);
      
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchProjects();
}, []);


  // 🔍 Search by project code (client side)
  const handleSearch = () => {
    if (!searchCode) return;

    const project = projects.find(
      (p) => p.projectCode === searchCode
    );

    if (!project) {
      alert("Project not found");
      setSearchedProject(null);
    } else {
      setSearchedProject(project);
    }
  };


  return (
    // <div className="dashboard-bg fade-in text-[#eff6e0] p-10">
    <div className="min-h-screen bg-[#d6e3da] p-8 ">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
{/* LEFT: Welcome */}
  <div>
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
      Welcome, <span className="text-blue-600">Dr. Paul</span> 👋
    </h1>
    <p className="text-gray-500 mt-1">
      Manage your projects and fund processes efficiently
    </p>
  </div>

  {/* RIGHT: Actions */}
  <div className="flex items-center gap-4">

    {/* Search */}
    <div className="flex items-center bg-white shadow rounded-full px-3 py-2 w-64">
      <input
        type="text"
        placeholder="Enter Project Code..."
        value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
        className="flex-1 outline-none text-sm px-2"
      />
      <button onClick={handleSearch} className="text-blue-600 text-sm font-medium">
        Search
      </button>
    </div>

    
    <button
          className="btn-primary "
          onClick={() => navigate("/projects")}
        >
          + Add Fund Bifurcation
        </button>
  </div>
  </div>
<div>

        {/* SEARCH RESULT */}
        {searchedProject && (
          <div className="glass-card p-6 mt-6 fade-in">
            <h3 className="text-lg font-semibold">
              {searchedProject.title}
            </h3>

            <p className="text-sm opacity-80 mb-4">
              {searchedProject.projectCode} ·{" "}
              <span>
                {searchedProject.status}
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  navigate(`/summary?project=${searchedProject._id}`)
                }
                className="border border-[#aec3b0] px-4 py-2 rounded-lg hover:bg-[#aec3b0] hover:text-black transition"
              >
                View Summary
              </button>

              {/* {searchedProject.status === "approved" && ( */}
                <button
                  onClick={() =>
                    navigate(`/fund-booking/${searchedProject._id}`)
                  }
                  className="btn-primary"
                >
                  Fund Booking
                </button>
            </div>
          </div>
        )}
      </div>

      {/* BIFURCATED PROJECT LIST */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Bifurcated Projects for Fund Booking
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {proj.piSubmissions?.title}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {proj.projectCode}
              </p>

              {/* STATUS BADGE */}
              <span className="inline-block mb-4 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Bifurcated ✔
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/summary/${proj._id}`)
                  }
                  className="border border-[#aec3b0] px-4 py-2 rounded-lg hover:bg-[#aec3b0] hover:text-black transition"
                >
                  View Summary
                </button>

                <button
                  onClick={() =>
                    navigate(`/fund-booking/${proj._id}`)
                  }
                  className="btn-primary"
                >
                  Fund Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

       {/* GENERAL PROCESSES */}
      <div>
         <h2 className="text-2xl font-semibold text-gray-800 m-6">
           General Processes
         </h2>
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* PROCESS CARD */}
          {[
            "No Dues",
            "Leave Approval",
            "NOC",
            "Reimbursement",
            "Advance",
            "Attendance",
          ].map((process) => (
            <div
              key={process}
              className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg cursor-pointer transition hover:bg-blue-50"
              onClick={() =>
                navigate(`/independent-process?process=${process}`)
              }
            >
              <p className="font-semibold text-gray-700">
                {process}
              </p>
            </div>
          ))}

        </div>
    </div>
    </div>
  );}
// import { useNavigate } from "react-router-dom";

// export default function DashboardPI() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">

// {/* HEADER */}
// <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">

//   {/* LEFT: Welcome */}
//   <div>
//     <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
//       Welcome, <span className="text-blue-600">Dr. Paul</span> 👋
//     </h1>
//     <p className="text-gray-500 mt-1">
//       Manage your projects and fund processes efficiently
//     </p>
//   </div>

//   {/* RIGHT: Actions */}
//   <div className="flex items-center gap-4">

//     {/* Compact Search */}
//     <div className="flex items-center bg-white shadow rounded-full px-3 py-2 w-64">
//       <input
//         type="text"
//         placeholder="Search Project..."
//         className="flex-1 outline-none text-sm px-2"
//       />
//       <button className="text-blue-600 text-sm font-medium">
//         Search
//       </button>
//     </div>

//     {/* CTA */}
//     <button
//       onClick={() => navigate("/projects")}
//       className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
//     >
//       + Bifurcation
//     </button>

//   </div>
// </div>

//       {/* SEARCH */}
//       <div className="bg-white rounded-2xl shadow p-6 mb-10">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           Search Project by Code
//         </h2>

//         <div className="flex gap-4">
//           <input
//             type="text"
//             placeholder="Enter Project Code"
//             className="flex-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
//             Search
//           </button>
//         </div>
//       </div>

//       {/* BIFURCATED PROJECTS */}
//       <div className="mb-12">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           Bifurcated Projects for Fund Booking
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
//           {/* CARD */}
//           <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               AI Research Project
//             </h3>

//             <p className="text-sm text-gray-500 mb-4">
//               PRJ-101 · 
//               <span className="text-green-600 font-medium ml-1">
//                 Bifurcated ✔
//               </span>
//             </p>

//             <div className="flex gap-3">
//               <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
//                 View Summary
//               </button>

//               <button
//                 onClick={() => navigate("/fund-booking/1")}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//               >
//                 Fund Booking
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* NON-BIFURCATED PROJECTS */}
//       <div className="mb-12">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           Projects Pending Bifurcation
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           {/* CARD */}
//           <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
//             <h3 className="text-lg font-semibold text-gray-800">
//               ML Grant Project
//             </h3>

//             <p className="text-sm text-gray-500 mb-4">
//               PRJ-202 · 
//               <span className="text-yellow-500 font-medium ml-1">
//                 Pending ⏳
//               </span>
//             </p>

//             <button
//               onClick={() => navigate("/projects")}
//               className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
//             >
//               Do Bifurcation
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* GENERAL PROCESSES */}
//       <div>
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           General Processes
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

//           {/* PROCESS CARD */}
//           {[
//             "No Dues",
//             "Leave Approval",
//             "NOC",
//             "Reimbursement",
//             "Advance",
//             "Attendance",
//           ].map((process) => (
//             <div
//               key={process}
//               className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg cursor-pointer transition hover:bg-blue-50"
//               onClick={() =>
//                 navigate(`/independent-process?process=${process}`)
//               }
//             >
//               <p className="font-semibold text-gray-700">
//                 {process}
//               </p>
//             </div>
//           ))}

//         </div>
//       </div>

//     </div>
//   );
// }