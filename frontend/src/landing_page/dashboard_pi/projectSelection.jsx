export default function ProjectSelection({ onSelect }) {

  // Dummy data (for demo)
  const projects = [
    {
      projectCode: "2026/CSE/0001",
      availableFunds: 500000,
      transactionId: "TXN12345",
      piName: "Dr. Sharma"
    },
    {
      projectCode: "2026/CSE/0002",
      availableFunds: 300000,
      transactionId: "TXN67890",
      piName: "Dr. Verma"
    },
    {
      projectCode: "2026/CSE/0003",
      availableFunds: 300000,
      transactionId: "TXN67890",
      piName: "Dr. Verma"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Select Project Code
      </h2>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition"
            onClick={() => onSelect(project)}
          >
            <p className="font-semibold text-blue-600">
              {project.projectCode}
            </p>
            <p className="text-sm text-gray-600">
              Available Funds: ₹{project.availableFunds}
            </p>
            <p className="text-sm text-gray-600">
              Transaction id : ₹{project.transactionId}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

// import { useEffect, useState } from "react";

// export default function ProjectSelection({ onSelect }) {

//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     fetch("http://localhost:5000/api/projects/pi-projects/pi-projects", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => {
//         if (!res.ok) {
//           throw new Error("Failed to fetch projects");
//         }
//         return res.json();
//       })
//       .then(data => {
//         console.log("Fetched projects:", data);
//         setProjects(data);
//       })
//       .catch(err => console.error(err));

//   }, []);

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-6">

//       <h2 className="text-xl font-semibold mb-6 text-gray-700">
//         Select Project Code
//       </h2>

//       <div className="space-y-4">

//         {projects.length === 0 && (
//           <p className="text-gray-500">No projects found</p>
//         )}

//         {projects.map((project) => (
//           <div
//             key={project._id}
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
//               Transaction Id: {project.transactionId}
//             </p>

//             <p className="text-sm text-gray-600">
//               PI: {project.piName}
//             </p>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }