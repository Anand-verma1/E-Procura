import { useState } from "react";

export default function DeanDashboard() {
  const [requests] = useState([
    {
      _id: "1",
      projectCode: "PRJ001",
      title: "AI Research Project",
      head: "Human Resource",
      process: "Manpower Hiring",
      requestedBy: "pi@iit.edu",
      piName: "Dr. Paul",
      requestedAmount: 900000,
      status: "pending",

      positions: [
        {
          role: "Project Assistant",
          post: 2,
          salary: 30000,
          months: 6,
        },
        {
          role: "JRF",
          post: 1,
          salary: 45000,
          months: 12,
        },
      ],
    },
  ]);

  const handleApprove = (id) => {
    console.log("Approved:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dean Dashboard
      </h1>

      <div className="space-y-8">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-2xl shadow-lg border p-6"
          >
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Fund Booking Request for {req.process}
            </h2>

            {/* Intro */}
            <p className="text-gray-700 leading-7">
              PI{" "}
              <span className="font-semibold">
                {req.piName}
              </span>{" "}
              has requested fund booking approval under
              Project Code{" "}
              <span className="font-semibold">
                {req.projectCode}
              </span>.
            </p>

            <p className="text-gray-700 mt-2">
              The requested amount has been verified against the
              available project budget under the selected fund head.
            </p>

            {/* Request Details */}
            <div className="mt-6 border rounded-xl p-4 bg-gray-50">

              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Request Details
              </h3>

              <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">

                <div>
                  <span className="font-semibold">
                    Project Title:
                  </span>{" "}
                  {req.title}
                </div>

                <div>
                  <span className="font-semibold">
                    Fund Head:
                  </span>{" "}
                  {req.head}
                </div>

                <div>
                  <span className="font-semibold">
                    Process:
                  </span>{" "}
                  {req.process}
                </div>

                <div>
                  <span className="font-semibold">
                    Requested By:
                  </span>{" "}
                  {req.requestedBy}
                </div>

                <div>
                  <span className="font-semibold">
                    Requested Amount:
                  </span>{" "}
                  ₹ {req.requestedAmount.toLocaleString()}
                </div>

              </div>
            </div>

            {/* Positions Table */}
            {req.process === "Manpower Hiring" && (
              <div className="mt-8">

                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Requested Positions
                </h3>

                <table className="w-full border border-gray-300 text-sm">

                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-3">Role</th>
                      <th className="border p-3">Posts</th>
                      <th className="border p-3">Salary</th>
                      <th className="border p-3">Months</th>
                      <th className="border p-3">Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {req.positions.map((p, index) => {
                      const amount =
                        p.post * p.salary * p.months;

                      return (
                        <tr
                          key={index}
                          className="text-center"
                        >
                          <td className="border p-3">
                            {p.role}
                          </td>

                          <td className="border p-3">
                            {p.post}
                          </td>

                          <td className="border p-3">
                            ₹ {p.salary.toLocaleString()}
                          </td>

                          <td className="border p-3">
                            {p.months}
                          </td>

                          <td className="border p-3 font-semibold">
                            ₹ {amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total */}
            <div className="mt-6 text-right text-xl font-bold text-gray-800">
              Total Requested Amount:
              ₹ {req.requestedAmount.toLocaleString()}
            </div>

            {/* Footer */}
            <p className="mt-6 text-gray-700">
              Please review and approve/reject this request.
            </p>

            {/* Buttons */}
            {req.status === "pending" && (
              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => handleApprove(req._id)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(req._id)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Reject
                </button>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}