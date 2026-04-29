// import { useParams, useSearchParams, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import PurchaseRequisitionForm from "./process_forms/PurchaseRequisitionForm";

// export default function FundBookingOption() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const[ searchParams] = useSearchParams();
//   const process = searchParams.get("process");
// //   const [process, setProcess] = useState("");

//   const processes = {
//     "Purchase of Material Procurement > 1 Lakh" : PurchaseRequisitionForm,
//     "Purchase of Material Procurement < 1 Lakh" : PurchaseRequisitionForm,
//     // "Project Staff recruitment",
//     // "Chair Person",
//     // "No Dues process",
//     // "Event Budget Approval",
//     // "Participants Accommodation Approval",
//     // "Internship Approval",
//     // "TA/DA Approval",
//     // "Travel Booking/Cab recuisition",
//     // "NOC issue/Attendance",
//     // "Leave Approval",
//     // "Advance taking",
//     // "Advance Settlement",
//     // "Tenure Extension",
//     // "Direct Purchase",
//     // "Reimbursement",   
//     // "Event / Workshop Expenses",
//   };
//   const SelectedForm = processes[process];

//   if (!process)
//     return <p className="p-10">Process not selected</p>;

//   if (!SelectedForm)
//     return <p className="p-10">Form not implemented yet</p>;

//   const handleContinue = () => {
//     if (!process) return alert("Select a process first");

//     navigate(
//       `/fund-booking/${projectId}?process=${encodeURIComponent(process)}`
//     );
//   };

//   return (
//     <div className="p-10">
//       <h1 className="text-3xl mb-6">
//         Which process do you want to initiate?
//       </h1>

//       <select
//         value={process}
//         onChange={(e) => setProcess(e.target.value)}
//         className="border p-3 rounded w-full max-w-md"
//       >
//         <option value="">Select Process</option>
//         {processes.map((p) => (
//           <option key={p} value={p}>
//             {p}
//           </option>
//         ))}
//       </select>

//       <button
//         onClick={handleContinue}
//         className="mt-6 bg-blue-600 text-white px-6 py-3 rounded"
//       >
//         Continue
//       </button>
//     </div>
//   );
// }
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import PurchaseRequisitionForm from "./process_forms/PurchaseRequisitionForm";
import ManpowerHiringForms from "./process_forms/ManpowerHiringForms" 

export default function FundBookingOption() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // process from URL
  const selectedProcessFromURL = searchParams.get("process");

  // dropdown selection state
  const [process, setProcess] = useState("");

  // process → form mapping
  const processForms = {
    "Purchase of Material Procurement > 1 Lakh":PurchaseRequisitionForm,
    "Purchase of Material Procurement < 1 Lakh":PurchaseRequisitionForm,
    "Project Staff recruitment (Man power Hiring)":ManpowerHiringForms,
    "Chair Person":null,
    "No Dues process":null,
    "Event Budget Approval":null,
    "Participants Accommodation Approval":null,
    "Internship Approval":null,
    "TA/DA Approval":null,
    "Travel Booking/Cab Requisition":null,
    "NOC issue/Attendance":null,
    "Leave Approval":null,
    "Advance taking":null,
    "Advance Settlement":null,
    "Tenure Extension":null,
    "Direct Purchase":null,
    "Reimbursement":null,   
    "Event / Workshop Expenses":null,
  }

const SelectedForm = selectedProcessFromURL
  ? processForms[selectedProcessFromURL]
  : null;

  const handleContinue = () => {
    if (!process) return alert("Select a process first");

    navigate(
      `/fund-booking/${projectId}?process=${encodeURIComponent(process)}`
    );
  };

  if (selectedProcessFromURL && !SelectedForm) {
  return (
    <div className="p-10">
      <h1 className="text-xl font-semibold">
        {selectedProcessFromURL}
      </h1>
      <p className="mt-4 text-gray-600">
        This process form is not available yet.
      </p>
    </div>
  );
}

  /* ---------- CASE 1: Show form ---------- */
  if (SelectedForm) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">
          {selectedProcessFromURL}
        </h1>

        <SelectedForm projectId={projectId} />
      </div>
    );
  }

  /* ---------- CASE 2: Show process selector ---------- */
  return (
    <div className="p-10">
      <h1 className="text-3xl mb-6">
        Which process do you want to initiate?
      </h1>

      <select
        value={process}
        onChange={(e) => setProcess(e.target.value)}
        className="border p-3 rounded w-full max-w-md"
      >
        <option value="">Select Process</option>

        {Object.keys(processForms).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <button
        onClick={handleContinue}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded"
      >
        Continue
      </button>
    </div>
  );
}
