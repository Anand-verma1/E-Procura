import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProjectSummary() {
  const [params] = useSearchParams();
  const projectId = params.get("project");

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/project/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          alert("Unable to fetch project");
          return;
        }

        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  if (loading) return <p className="p-10 text-gray-700">Loading...</p>;
  if (!project) return <p className="p-10 text-gray-700">No project found</p>;

  const handleDecision = async (action) => {
  if (!window.confirm(`Confirm ${action}?`)) return;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pem";
  input.click();

  input.onchange = async () => {
    const privateKeyPem = await input.files[0].text();

    const signData = {
      projectId,
      action,
      role: user.role,
    };

    const b64 = privateKeyPem
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\s/g, "");

    const binary = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binary.buffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      { name: "RSASSA-PKCS1-v1_5" },
      cryptoKey,
      new TextEncoder().encode(JSON.stringify(signData))
    );

    const signature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuffer))
    );

    const token = localStorage.getItem("token");

    const endpoint =
      user.role === "RND"
        ? `/project/rnd-action/${projectId}`
        : `/project/dean-action/${projectId}`;

    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, signature }),
    });

    if (res.ok) {
      alert("Decision submitted");
      window.location.reload();
    } else {
      alert("Decision failed");
    }
  };
};
// Open File with Tamper Detection
const openFile = async () => {
  try{
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/project/file/${project._id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

    const data = await res.json();

    if (data.tampered) {
      alert(data.message || "⚠ FILE INTEGRITY COMPROMISED!");
      // return;
    }

    window.open(data.fileUrl, "_blank");
  } catch (err) {
    alert("Unable to open file");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Project Summary</h1>

        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
          {project.status?.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* BASIC INFO */}
      <div className="bg-white rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-semibold">Title:</span> {project.title}
          </p>
          <p>
            <span className="font-semibold">Project Code:</span>{" "}
            {project.projectId}
          </p>
          <p>
            <span className="font-semibold">Department:</span>{" "}
            {project.department}
          </p>
          <p>
            <span className="font-semibold">PI Name:</span> {project.piName}
          </p>
          <p>
            <span className="font-semibold">Total Fund Received:</span> ₹
            {project.totalFundReceived}
          </p>
          <p>
            <span className="font-semibold">Available Fund:</span> ₹{project.availableFund}
          </p>
          <p>
            <span className="font-semibold">Bifurcation Year:</span>{" "}
            {project.bifurcationYear}
          </p>
        </div>
      </div>

      {/* DIVISION HEADS */}
      <div className="bg-white rounded-2xl shadow p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Head-wise Fund Allocation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(project.divisionHeads || {}).map(([key, value]) => (
            <div
              key={key}
              className="border rounded-xl p-4 bg-gray-50 hover:shadow transition"
            >
              <p className="text-gray-600 font-medium">{key}</p>
              <p className="text-xl font-bold text-gray-800">₹{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attachment */}
<div className="mt-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-2">
    Attached Document
  </h3>

  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg border">
    <div>
      <p className="text-gray-700 font-medium">
        {project.attachmentOriginalName}
      </p>
      <p className="text-sm text-gray-500">
        Uploaded document
      </p>
    </div>

    <div className="flex gap-3">
      {/* View */}
      <a onClick ={openFile}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View
      </a>

      {/* Download */}
      <a
        onClick ={openFile}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Download
      </a>
    </div>
  </div>


        {/* APPROVAL PANEL */}
{((user?.role === "RND" && project.status === "pending_rnd") ||
  (user?.role === "DEAN" && project.status === "pending_dean")) && (

  <div className="mt-10 bg-yellow-50 border border-yellow-300 rounded-xl p-6">
    <h2 className="text-xl font-semibold mb-4">
      Approval Decision
    </h2>

    <div className="flex gap-4">
      <button
        onClick={() => handleDecision("approve")}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Approve
      </button>

      <button
        onClick={() => handleDecision("reject")}
        className="bg-red-600 text-white px-6 py-2 rounded"
      >
        Reject
      </button>
    </div>
  </div>
)}

      </div>

      {/* FOOTER */}
      <div className="text-sm text-gray-500">
        Submitted by: <span className="font-medium">{project.submittedBy}</span>
      </div>
    </div>
  );
}
