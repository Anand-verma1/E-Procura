import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


async function readPem(file) {
  const text = await file.text();
  return text
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s+/g, "");
}

async function importPrivateKey(pem) {
  const binary = Uint8Array.from(atob(pem), c => c.charCodeAt(0));

  return await window.crypto.subtle.importKey(
    "pkcs8",
    binary.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );
}

async function signData(privateKey, data) {
  const enc = new TextEncoder().encode(JSON.stringify(data));

  const signature = await window.crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    enc
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function hashPdf(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
 
// for sorting top-level keys in payload
function canonicalPayload(obj) {
  const ordered = {};
  Object.keys(obj).sort().forEach(k => {
    ordered[k] = obj[k];
  });
  return ordered;
}


export default function ProjectDivisionForm({project}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    department: "",
    piName: "",
    totalFundReceived: "",
    availableFund: "",
    bifurcationYear: "",
    divisionHeads: {
      "Manpower (including Interns)": "",
      Equipment: "",
      "Consumables/Contingency/Travel": "",
      "Bootcamps/Events": "",
      Overhead: "",
      
    },
    attachment: null,
    privateKeyFile: null,
  });
// Populate auto-fields from selected project
  useEffect(() => {
    if (project) {
      setFormData(prev => ({
        ...prev,
        projectId: project.projectId,
        title: project.title || "",
        department: project.department,
        piName: project.piName || "",
        totalFundReceived: project.totalFundReceived || "",
        availableFund: project.availableFund || "",
        bifurcationYear: project.bifurcationYear || "",
      }));
    }
  }, [project]);
  function handleChange(e) {
    const { name, value } = e.target;
    if (formData.divisionHeads.hasOwnProperty(name)) {
      setFormData({
        ...formData,
        divisionHeads: { ...formData.divisionHeads, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleFileChange(e) {
    setFormData({ ...formData, attachment: e.target.files[0] });
  }

  function handleKeyFileChange(e) {
    setFormData({ ...formData, privateKeyFile: e.target.files[0] });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!formData.privateKeyFile) {
    alert("Upload private key");
    return;
  }

  const pdfHash = await hashPdf(formData.attachment)
  console.log("pdfHash", pdfHash);
  
  const payload = canonicalPayload( {
    projectId: formData.projectId,
    title: formData.title,
    department: formData.department,
    piName: formData.piName,
    totalFundReceived: formData.totalFundReceived,
    bifurcationYear: formData.bifurcationYear,
    divisionHeads: formData.divisionHeads,
    pdfHash: pdfHash,
    role: "PI",
    timestamp:new Date().toISOString()
  });

  const pem = await readPem(formData.privateKeyFile);
  const privateKey = await importPrivateKey(pem);
  const signature = await signData(privateKey, payload);

  // sending data to backend
  const sendData = new FormData();
  sendData.append("formData", JSON.stringify(payload));
  sendData.append("signature", signature);
  sendData.append("attachment", formData.attachment);

  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/project/submit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: sendData,
  });

  const text = await res.text();
  if (res.ok) {
  alert("✅ Submitted");
  navigate("/pi-dashboard");
} else {
  alert(text);
}
}
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-tr from-gray-100 to-gray-50">
      <div className="glass-card w-full max-w-4xl p-8 shadow-lg fade-in">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Project Registration Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Project ID</label>
              <input type="text" name="projectId" value={formData.projectId} onChange={handleChange} required className="w-full p-3 border rounded" disabled/>
            </div>
            <div>
              <label>Project Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>PI Name</label>
              <input disabled type="text" name="piName" value={formData.piName} onChange={handleChange} required className="w-full p-3 border rounded" />
            </div>
            <div>
              <label>Department</label>
              <input disabled type="text" name="department" value={formData.department} readOnly className="w-full p-3 border bg-gray-100 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Total Fund Received (₹)</label>
              <input disabled type="number" name="totalFundReceived" value={formData.totalFundReceived} onChange={handleChange} required className="w-full p-3 border rounded" />
            </div>
            <div>
              <label>Available Fund (₹)</label>
              <input disabled type="number" name="availableFund" value={formData.availableFund} onChange={handleChange} required className="w-full p-3 border rounded" />
            </div>
            <div>
              <label>Funding Year</label>
              <input disabled type="number" name="bifurcationYear" value={formData.bifurcationYear} onChange={handleChange} required className="w-full p-3 border rounded" />
            </div>
          </div>

          {/* Division Heads */}
          <h3>Bifurcation of Fund</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(formData.divisionHeads).map((head, i) => (
              <div key={i}>
                <label>{head}</label>
                <input type="number" name={head} value={formData.divisionHeads[head]} onChange={handleChange} required className="w-full p-3 border rounded" />
              </div>
            ))}
          </div>

          {/* Attachment */}
          <div>
            <label>Sanction Order (PDF Only)</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} required className="w-full mt-2 p-2 border rounded" />
          </div>

          {/* Private Key */}
          <div>
            <label>Enter Your Private Key (.pem)</label>
            <input type="file" accept=".pem" onChange={handleKeyFileChange} required className="w-full mt-2 p-2 border rounded" />
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded">
            Submit & Sign
          </button>
        </form>
      </div>
    </div>
  );
}
