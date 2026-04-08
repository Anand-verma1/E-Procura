import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Required validation
    if (!form.email || !form.password || !form.role) {
      return setError("All fields are required");
    }

    // 🔴 IIT Bhilai email validation
    if (!form.email.endsWith("@iitbhilai.ac.in")) {
      return setError("Email must end with @iitbhilai.ac.in");
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/login", form);

      // ✅ Save token
      localStorage.setItem("token", res.data.token);
      
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.fullName);

      // ✅ Role-based dashboard redirect
      if (res.data.user.role === "PI") navigate("/pi-dashboard");
      else if (res.data.user.role === "RND") navigate("/rnd-dashboard");
      else if (res.data.user.role === "DEAN") navigate("/dean-dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      />

      <select
        name="role"
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-white text-black outline-none"
      >
        <option value="">Select Role</option>
        <option value="PI">Principal Investigator (PI)</option>
        <option value="RND">R&D</option>
        <option value="DEAN">DEAN</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--primaryAccent)] hover:bg-[var(--primaryAccent)]/80 text-white py-2 rounded-lg font-semibold mt-2"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

