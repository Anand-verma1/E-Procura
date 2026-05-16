import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ManpowerHiringForm from "./process_forms/ManpowerHiringForm";

export default function FundBookingPage() {
  const { id } = useParams(); // id from route
  const [project, setProject] = useState(null);
  const [piEmail, setPiEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [process, setProcess] = useState("");
  const [selectedHead, setSelectedHead] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [positions, setPositions] = useState([
    { role: "", post: "", salary: "", months: "", amount: 0 },
  ]);

  // process option
  const processOptions = [
    {
      label: "Purchase of Material Procurement > 1 Lakh",
      value: "purchase_gt_1L",
    },
    {
      label: "Purchase of Material Procurement < 1 Lakh",
      value: "purchase_lt_1L",
    },
    {
      label: "Project Staff recruitment (Man power Hiring)",
      value: "manpower",
    },
    {
      label: "Chair Person",
      value: "chair_person",
    },
    {
      label: "Event Budget Approval",
      value: "event_budget",
    },
    {
      label: "Participants Accommodation Approval",
      value: "accommodation",
    },
    {
      label: "Internship Approval",
      value: "internship",
    },
    {
      label: "TA/DA Approval",
      value: "tada",
    },
    {
      label: "Travel Booking / Cab Requisition",
      value: "travel",
    },
    {
      label: "NOC issue / Attendance",
      value: "noc_attendance",
    },
    {
      label: "Advance taking",
      value: "advance_take",
    },
    {
      label: "Advance Settlement",
      value: "advance_settlement",
    },
    {
      label: "Tenure Extension",
      value: "tenure_extension",
    },
    {
      label: "Direct Purchase",
      value: "direct_purchase",
    },
    {
      label: "Reimbursement",
      value: "reimbursement",
    },
    {
      label: "Event / Workshop Expenses",
      value: "event_expense",
    },
  ];
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          alert("Unable to fetch project");
          return;
        }

        const data = await res.json();
        console.log("project data", data);

        setProject(data);

        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setPiEmail(payload.email || "");
        } catch {}
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) return <p className="p-10 text-gray-700">Loading...</p>;
  if (!project) return <p className="p-10 text-gray-700">No project found</p>;

  const handleSubmit = async () => {
    try {
      if (!selectedHead) {
        alert("Please select a fund head");
        return;
      }

      if (!process) {
        alert("Please select a process");
        return;
      }
      if (process !== "manpower" && !requestedAmount) {
  alert("Enter requested amount");
  return;
}
      if (process==="manpower"){
      const isInvalidPosition = positions.some(
        (p) => !p.role || !p.post || !p.salary || !p.months,
      );

      if (isInvalidPosition) {
        alert("Fill all position fields properly");
        return;
      }

      if (totalAmount <= 0) {
        alert("Invalid total amount");
        return;
      }
    }
      const cleanPositions = positions.map(
        ({ role, post, salary, months }) => ({
          role,
          post,
          salary,
          months,
        }),
      );

      setLoadingSubmit(true);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/fund-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          projectId: project._id,
          head: selectedHead,
          positions: cleanPositions,
          process: process,
          requestedAmount,
        }),
      });

      const data = await res.json();
      console.log("submit ka", data);

      if (res.ok) {
        alert("Sent to Dean 🚀");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // handle row change
  const handleChange = (index, field, value) => {
    const updated = [...positions];
    updated[index][field] = value;

    const post = Number(updated[index].post) || 0;
    const salary = Number(updated[index].salary) || 0;
    const months = Number(updated[index].months) || 0;

    updated[index].amount = post * salary * months;

    setPositions(updated);
  };

  // add row
  const addPosition = () => {
    setPositions([
      ...positions,
      { role: "", post: "", salary: "", months: "", amount: 0 },
    ]);
  };

  // All total
const totalAmount =
  process === "manpower"
    ? positions.reduce((sum, p) => sum + p.amount, 0)
    : Number(requestedAmount || 0);
    
  // validation
  const isExceeded =
    selectedHead &&
    totalAmount> project.piSubmissions?.divisionHeads[selectedHead];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Fund Booking</h2>

        {/* Project Code */}
        <p className="mb-6 text-gray-600">
          <span className="font-semibold">Project Code:</span>{" "}
          {project.projectCode}
        </p>
        {/* Project title */}
        <p className="mb-6 text-gray-600">
          <span className="font-semibold">Project Title:</span>{" "}
          {project.piSubmissions?.title}
        </p>

        {/* Select Head */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Select Fund Head</label>

          <select
            value={selectedHead}
            onChange={(e) => setSelectedHead(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Head</option>

            {Object.entries(project.piSubmissions?.divisionHeads || {}).map(
              ([key, value]) => (
                <option key={key} value={key}>
                  {key} (₹{value})
                </option>
              ),
            )}
          </select>

          {selectedHead && (
            <p className="mt-2 text-sm text-gray-600">
              Available Fund: ₹
              {project.piSubmissions?.divisionHeads[selectedHead]}
            </p>
          )}
        </div>

        {/* Select Process */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Select Process</label>

          <select
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Process</option>
            {processOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {process === "manpower" && (
          <ManpowerHiringForm
            projectId={project._id}
            projectCode={project.projectCode}
            projectTitle={project.piSubmissions?.title}
            piName={project.piName}
            piEmail={piEmail}
          />
        )}
      </div>
       {/* Other Processes Form */}
            {process && process !== "manpower" && (
  <div className="border-t pt-6 mt-6">
    <h3 className="text-lg font-semibold mb-4">
      Requested Amount
    </h3>

    <input
      type="number"
      placeholder="Enter requested amount"
      value={requestedAmount}
      onChange={(e) => setRequestedAmount(e.target.value)}
      className="border px-4 py-2 rounded w-full"
    />

    <div className="mt-4 text-lg font-semibold">
      Total: ₹ {Number(requestedAmount || 0).toLocaleString()}
    </div>

    {selectedHead &&
      Number(requestedAmount) >
        project.piSubmissions?.divisionHeads[selectedHead] && (
        <p className="text-red-500 mt-2 text-sm">
          ⚠ Amount exceeds selected head budget
        </p>
      )}
  </div>
)}
                  {/* Submit */}
                  {process && (
            <button
              onClick={handleSubmit}
              disabled={!selectedHead || isExceeded || !process}
              className={`mt-6 px-6 py-2 rounded-lg text-white ${
                !selectedHead || isExceeded
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Submit to Dean
            </button>
                  )}
    </div>
  );
}
