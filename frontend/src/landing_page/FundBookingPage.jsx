import { useState } from "react";

export default function FundBookingPage() {
  const [process, setProcess] = useState("");
  const [selectedHead, setSelectedHead] = useState("");

  const [positions, setPositions] = useState([
    { role: "", count: "", salary: "", months: "", amount: 0 },
  ]);

  const project = {
    projectCode: "2026/CSE/0001",
    heads: {
      Equipment: 500000,
      Manpower: 300000,
      Travel: 100000,
      Consumables: 80000,
      Misc: 50000,
    },
  };

  // handle row change
  const handleChange = (index, field, value) => {
    const updated = [...positions];
    updated[index][field] = value;

    const count = Number(updated[index].count) || 0;
    const salary = Number(updated[index].salary) || 0;
    const months = Number(updated[index].months) || 0;

    updated[index].amount = count * salary * months;

    setPositions(updated);
  };

  // add row
  const addPosition = () => {
    setPositions([
      ...positions,
      { role: "", count: "", salary: "", months: "", amount: 0 },
    ]);
  };

  // total
  const totalAmount = positions.reduce((sum, p) => sum + p.amount, 0);

  // validation
  const isExceeded =
    selectedHead &&
    totalAmount > project.heads[selectedHead];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Fund Booking
        </h2>

        {/* Project Code */}
        <p className="mb-6 text-gray-600">
          <span className="font-semibold">Project Code:</span>{" "}
          {project.projectCode}
        </p>

        {/* Select Head */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">
            Select Fund Head
          </label>

          <select
            value={selectedHead}
            onChange={(e) => setSelectedHead(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Head</option>

            {Object.entries(project.heads).map(([key, value]) => (
              <option key={key} value={key}>
                {key} (₹{value})
              </option>
            ))}
          </select>

          {selectedHead && (
            <p className="mt-2 text-sm text-gray-600">
              Available Amount: ₹{project.heads[selectedHead]}
            </p>
          )}
        </div>

        {/* Select Process */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">
            Select Process
          </label>

          <select
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select</option>
            <option value="manpower">Manpower Hiring</option>
            <option value="equipment">Equipment Purchase</option>
          </select>
        </div>

        {/* MANPOWER FORM */}
        {process === "manpower" && (
          <div className="border-t pt-6 mt-6">

            <h3 className="text-lg font-semibold mb-4">
              Manpower Hiring Details
            </h3>

            {/* Table */}
            <div className="space-y-4">
              {positions.map((pos, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-3 items-center"
                >
                  <input
                    placeholder="Role"
                    value={pos.role}
                    onChange={(e) =>
                      handleChange(index, "role", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Count"
                    value={pos.count}
                    onChange={(e) =>
                      handleChange(index, "count", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Salary"
                    value={pos.salary}
                    onChange={(e) =>
                      handleChange(index, "salary", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Months"
                    value={pos.months}
                    onChange={(e) =>
                      handleChange(index, "months", e.target.value)
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <div className="font-semibold text-gray-700">
                    ₹ {pos.amount}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Row */}
            <button
              onClick={addPosition}
              className="mt-4 text-blue-600"
            >
              + Add Position
            </button>

            {/* Total */}
            <div className="mt-6 text-lg font-semibold">
              Total: ₹ {totalAmount}
            </div>

            {/* Validation */}
            {isExceeded && (
              <p className="text-red-500 mt-2 text-sm">
                ⚠ Amount exceeds selected head budget
              </p>
            )}

            {/* Submit */}
            <button
              disabled={!selectedHead || isExceeded}
              className={`mt-6 px-6 py-2 rounded-lg text-white ${
                !selectedHead || isExceeded
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Submit to Dean
            </button>
          </div>
        )}
      </div>
    </div>
  );
}