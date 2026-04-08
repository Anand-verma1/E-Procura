import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    employeeId: "",
    department: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  
    // Dynamic required validation
  const validate = () => {
  let temp = {};

  if (!form.fullName) temp.fullName = "Full Name is required";
  if (!form.email) temp.email = "Email is required";
  if (!form.employeeId) temp.employeeId = "Employee ID is required";
  if (!form.department) temp.department = "Please select a department";
  if (!form.role) temp.role = "Please select a role";
  if (!form.password) temp.password = "Password is required";
  if (!form.confirmPassword) temp.confirmPassword = "Confirm your password";

  if (
    form.password &&
    form.confirmPassword &&
    form.password !== form.confirmPassword
  ) {
    temp.confirmPassword = "Passwords do not match";
  }

  setError(Object.values(temp)[0] || ""); // show first error message
  return Object.keys(temp).length === 0;  // ❗ IMPORTANT RETURN
};


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    validate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!validate()) return;
    setError("");

  if (!form.email.endsWith("@iitbhilai.ac.in")) {
    return setError("Email must end with @iitbhilai.ac.in");
  }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/signup", form);

      if (res.data.success) {
        localStorage.setItem("signupEmail", form.email);
        navigate("/generate-key");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow border border-white/20"
    >
      {error && (
        <p className="text-red-400 bg-white/20 p-2 rounded">{error}</p>
      )}

      <input
        name="fullName"
        type="text"
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      />

      <input
        name="employeeId"
        type="text"
        placeholder="Employee ID"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      />

      <select
        name="department"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      >
        <option value="">Select Department</option>
        <option>CSE</option>
        <option>ECE</option>
        <option>Mechanical</option>
        <option>Civil</option>
        <option>Electrical</option>
        <option>R&D Department</option>
      </select>

      <select
        name="role"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      >
        <option value="">Select Role</option>
        <option value="PI">Principal Investigator (PI)</option>
        <option value="RND">RND</option>
        <option value="DEAN">Dean</option>
      </select>

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      />

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      />

      <button className="w-full bg-[var(--primaryAccent)] hover:bg-[var(--primaryAccent)]/70 text-white py-2 rounded-lg font-semibold mt-2">
        Continue → Generate Keys
      </button>
    </form>
  );
}
