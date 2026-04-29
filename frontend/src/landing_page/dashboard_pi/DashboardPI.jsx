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
    <div className="dashboard-bg fade-in text-[#eff6e0] p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-wide">PI Dashboard</h1>

        <button className="btn-primary">Bifurcated Projects</button>

        <button className="btn-primary" onClick={() => navigate("/projects")}>
          + Fund Bifurcation
        </button>
      </div>

      {/* SEARCH */}
      <div className="glass-card p-7 mb-12">
        <h2 className="text-xl font-semibold mb-4">Search Project by Code</h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Project Code"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="flex-1 p-3 rounded-xl text-black outline-none"
          />

          <button onClick={handleSearch} className="btn-primary">
            Search
          </button>
        </div>

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

      {/* PROJECT LIST */}
      <h2 className="text-2xl font-semibold mb-6">
        Bifurcated Projects for Fund Booking
      </h2>

      {projects.length === 0 ? (
        <p className="opacity-70">No projects available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div key={proj._id} className="glass-card p-6">
              <h3 className="text-lg font-semibold">{proj.title}</h3>

              <p className="text-sm opacity-70 mb-4">
                {proj.projectCode} · <span>{proj.status}</span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/summary/${proj._id}`)}
                  className="border border-[#aec3b0] px-4 py-2 rounded-lg hover:bg-[#aec3b0] hover:text-black transition"
                >
                  View Summary
                </button>

                <button
                  onClick={() => navigate(`/fund-booking/${proj._id}`)}
                  className="btn-primary"
                >
                  Fund Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
