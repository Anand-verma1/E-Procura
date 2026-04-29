import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardPI() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchedProject, setSearchedProject] = useState(null);

  // 🔹 Fetch PI projects (latest team API)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/projects/bifurcated",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  // 🔍 Search by project code
  const handleSearch = () => {
    if (!searchCode.trim()) return;

    const project = projects.find(
      (p) => p.projectCode?.toLowerCase() === searchCode.toLowerCase(),
    );

    if (!project) {
      alert("Project not found");
      setSearchedProject(null);
    } else {
      setSearchedProject(project);
    }
  };

  return (
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
            <h3 className="text-lg font-semibold">{searchedProject.title}</h3>

            <p className="text-sm opacity-80 mb-4">
              {searchedProject.projectCode} ·{" "}
              <span>{searchedProject.status}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/summary/${searchedProject._id}`)}
                className="border border-[#aec3b0] px-4 py-2 rounded-lg hover:bg-[#aec3b0] hover:text-black transition"
              >
                View Summary
              </button>

              <button
                onClick={() => navigate(`/fund-booking/${searchedProject._id}`)}
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
                  onClick={() => navigate(`/summary/${proj._id}`)}
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
  );
}
