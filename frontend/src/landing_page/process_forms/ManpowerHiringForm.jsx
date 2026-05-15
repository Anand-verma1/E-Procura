import { useState } from "react";

const POSITION_TYPES = [
  { value: "postdoc",             label: "Post Doctoral Fellow" },
  { value: "assistant",           label: "Project Assistant" },
  { value: "associate",           label: "Project Associate" },
  { value: "jrf",                 label: "Project Assistant / JRF" },
  { value: "assistant_associate", label: "Project Assistant / Project Associate" },
];

const PI_PRESETS = [
  { name: "Dr. Souradyuti Paul", designation: "Associate Professor in Department of CSE", address: "405B, ED1, IIT Bhilai, Kutelabhata, Durg, CG, 491002", email: "souradyuti@iitbhilai.ac.in", website: "souradyutip.github.io" },
];

const AGENCIES  = ["MeitY", "DST", "SERB", "DRDO", "ISRO", "DBT", "CSIR", "ICAR"];
const DURATIONS = ["3 months (extendable)", "6 months", "12 months", "24 months", "36 months"];
const COMM_POOL = ["Dr. Souradyuti Paul (Chairman)", "Dr. Amit K. Dhar", "Dr. Soumajit Pramanik", "Dr. Rajesh Kumar", "Dr. Priya Sharma"];

const ESSENTIAL_QUALS = {
  postdoc:             ["PhD in CSE or a related discipline", "PhD in Mathematics / Statistics with strong computing background", "PhD in Electronics / Communication Engineering"],
  assistant:           ["A 3-year diploma in CS/IT plus 2 years of job experience in CS/IT", "BE/BTech in CS/IT", "MSc in CS/IT", "MCA from a recognized university"],
  associate:           ["A 3-year diploma in CS/IT plus 2 years of job experience in CS/IT", "BE/BTech in CS/IT", "MSc in CS/IT", "MCA from a recognized university", "ME/MTech in CS/IT"],
  jrf:                 ["A 3-year diploma in CS/IT plus 2 years of job experience in CS/IT", "BE/BTech in CS/IT", "MSc in CS/IT", "MCA from a recognized university"],
  assistant_associate: ["A 3-year diploma in CS/IT plus 2 years of job experience in CS/IT", "BE/BTech in CS/IT", "MSc in CS/IT", "MCA from a recognized university"],
};

const DESIRABLE_QUALS = [
  "Android app development (Java, Kotlin, etc.)",
  "Android app security tools (MobSF, ADB, Frida, etc.)",
  "Full-Stack web development (ReactJS, NodeJS, Express, PHP, MongoDB)",
  "Blockchain (Ethereum (Quorum/Besu), Hyperledger Fabric)",
  "Smart contracts (Solidity, Chaincode)",
  "Advanced Cryptography (ZKP, MPC, Advanced signature schemes, etc.)",
  "Web3 security tools (Slither, MythX, zk-SNARKs, etc.)",
  "Penetration testing (e.g. Burp suite)",
  "APK testing (e.g. Frida)",
  "Scalable backends (Node.js, Python)",
  "Network security issues (VLAN, MAC, DHCP, etc.)",
  "Machine Learning / Deep Learning",
  "Data Science and Analytics",
  "Cloud computing (AWS, GCP, Azure)",
];

const SALARY_MAP = {
  postdoc:             { min: "55,000", max: "55,000", note: "consolidated + ₹2,00,000 research grant/year" },
  assistant:           { min: "28,000", max: "41,000", note: "consolidated" },
  associate:           { min: "35,000", max: "50,000", note: "consolidated" },
  jrf:                 { min: "28,000", max: "41,000", note: "consolidated" },
  assistant_associate: { min: "28,000", max: "50,000", note: "consolidated" },
};

const AGE_MAP     = { postdoc: "50", assistant: "35", associate: "45", jrf: "35", assistant_associate: "35 (assistant), 45 (associate)" };
const SUBJECT_MAP = { postdoc: "MeiTy-PostDoc", assistant: "MeiTy-ProjectAssistant", associate: "MeiTy-ProjectAssociate", jrf: "MeiTy-ProjectAssistant/JRF", assistant_associate: "MeiTy-ProjectAssistant/Associate" };

const STANDARD_TERMS = [
  "No TA/DA will be provided to the candidate for the interview.",
  "The decision of the selection committee will be final.",
  "If the number of candidates appearing for the interview is large, the selection committee may decide to restrict the number of candidates to a reasonable limit after considering qualifications and experience over and above the minimum prescribed.",
  "The appointment will be governed by the terms and conditions of the Institute/Funding agency applicable to the said project.",
  "The selected candidate will have to join duty immediately on receipt of the offer.",
  "The fellowship may be terminated with a 30-day notice before completion of the tenure if performance is not deemed satisfactory.",
  "IIT Bhilai reserves the right to fill or not to fill any or all the posts.",
];

const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white";
const labelCls = "block text-sm font-semibold text-gray-700 mb-1";
const sectionTitle = "text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200";

function Field({ label, required, children, half }) {
  return (
    <div className={half ? "" : ""}>
      <label className={labelCls}>{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
    </div>
  );
}

function StepBar({ step }) {
  const steps = ["Project & PI", "Position & Qualifications", "Review & Submit"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${done || active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                {done ? "✓" : n}
              </div>
              <span className={`text-xs font-medium text-center w-24 leading-tight
                ${active ? "text-blue-600 font-bold" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-1 mb-4 transition-all ${step > n ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ManpowerHiringForm() {
  const [step, setStep] = useState(1);

  const [reqDate,   setReqDate]   = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [projCode,  setProjCode]  = useState("");
  const [agency,    setAgency]    = useState("");
  const [piName,    setPiName]    = useState("");
  const [piDesig,   setPiDesig]   = useState("");
  const [piAddr,    setPiAddr]    = useState("");
  const [piEmail,   setPiEmail]   = useState("");
  const [piWeb,     setPiWeb]     = useState("");

  const [posType,    setPosType]    = useState("");
  const [numPosts,   setNumPosts]   = useState("");
  const [ageLimit,   setAgeLimit]   = useState("");
  const [salMin,     setSalMin]     = useState("");
  const [salMax,     setSalMax]     = useState("");
  const [salNote,    setSalNote]    = useState("");
  const [duration,   setDuration]   = useState("");
  const [deadline,   setDeadline]   = useState("");
  const [notifDate,  setNotifDate]  = useState("");
  const [emailSub,   setEmailSub]   = useState("");
  const [essentials, setEssentials] = useState([]);
  const [customEss,  setCustomEss]  = useState("");
  const [desirables, setDesirables] = useState([]);
  const [customDes,  setCustomDes]  = useState("");

  const [committee,   setCommittee]   = useState([""]);
  const [activeTerms, setActiveTerms] = useState(STANDARD_TERMS.map((_, i) => i));
  const [customTerm,  setCustomTerm]  = useState("");

  const fillPI = (p) => { setPiName(p.name); setPiDesig(p.designation); setPiAddr(p.address); setPiEmail(p.email); setPiWeb(p.website); };

  const pickPos = (v) => {
    setPosType(v); setEssentials([]);
    const s = SALARY_MAP[v];
    if (s) { setSalMin(s.min); setSalMax(s.max); setSalNote(s.note); }
    setAgeLimit(AGE_MAP[v] || "");
    setEmailSub(SUBJECT_MAP[v] || "");
  };

  const togEss  = (q) => setEssentials((p) => p.includes(q) ? p.filter((x) => x !== q) : [...p, q]);
  const togDes  = (q) => setDesirables((p) => p.includes(q) ? p.filter((x) => x !== q) : [...p, q]);
  const togTerm = (i) => setActiveTerms((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  const setMem  = (i, v) => setCommittee((p) => { const c = [...p]; c[i] = v; return c; });
  const delMem  = (i) => setCommittee((p) => p.filter((_, j) => j !== i));

  const essBase        = posType ? ESSENTIAL_QUALS[posType] : [];
  const customEssItems = essentials.filter((q) => !essBase.includes(q));
  const customDesItems = desirables.filter((q) => !DESIRABLE_QUALS.includes(q));
  const posLabel       = POSITION_TYPES.find((p) => p.value === posType)?.label || "—";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manpower Hiring Request</h2>
          <p className="text-sm text-gray-500 mt-1">IIT Bhilai — R&D Office</p>
        </div>

        {/* Step bar */}
        <StepBar step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="space-y-6">

            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className={sectionTitle}>Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Date of Request" required>
                  <input type="date" value={reqDate} onChange={(e) => setReqDate(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Project Code">
                  <input value={projCode} onChange={(e) => setProjCode(e.target.value)} placeholder="e.g. 2019500" className={inputCls} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Project Title" required>
                    <textarea value={projTitle} onChange={(e) => setProjTitle(e.target.value)} rows={2}
                      placeholder='"FinTech Security with (or without) Blockchain"' className={inputCls + " resize-none"} />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Sponsoring Agency" required>
                    <input value={agency} onChange={(e) => setAgency(e.target.value)} placeholder="e.g. MeitY" className={inputCls} />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {AGENCIES.map((a) => (
                        <button key={a} onClick={() => setAgency(a)}
                          className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                          {a}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            {/* PI Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className={sectionTitle}>Principal Investigator</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Quick-fill:</p>
                <div className="flex flex-wrap gap-2">
                  {PI_PRESETS.map((pi, i) => (
                    <button key={i} onClick={() => fillPI(pi)}
                      className="text-sm px-4 py-1.5 rounded-lg border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 transition font-medium">
                      {pi.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <input value={piName} onChange={(e) => setPiName(e.target.value)} placeholder="Dr. Full Name" className={inputCls} />
                </Field>
                <Field label="Email ID" required>
                  <input type="email" value={piEmail} onChange={(e) => setPiEmail(e.target.value)} placeholder="name@iitbhilai.ac.in" className={inputCls} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Designation" required>
                    <input value={piDesig} onChange={(e) => setPiDesig(e.target.value)} placeholder="e.g. Associate Professor in Department of CSE" className={inputCls} />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Office Address">
                    <textarea value={piAddr} onChange={(e) => setPiAddr(e.target.value)} rows={2}
                      placeholder="Room, Building, IIT Bhilai, ..." className={inputCls + " resize-none"} />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Website">
                    <input value={piWeb} onChange={(e) => setPiWeb(e.target.value)} placeholder="e.g. yourname.github.io" className={inputCls} />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="space-y-6">

            {/* Position type */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className={sectionTitle}>Position Type</h3>
              <p className="text-sm text-gray-500 mb-3">Salary, age limit and email subject will auto-fill once you pick one.</p>
              <div className="flex flex-wrap gap-2">
                {POSITION_TYPES.map((p) => (
                  <label key={p.value} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm transition
                    ${posType === p.value ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                    <input type="radio" name="postype" checked={posType === p.value} onChange={() => pickPos(p.value)} className="accent-blue-600" />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Position details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className={sectionTitle}>Position Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Number of Posts" required>
                  <input type="number" value={numPosts} onChange={(e) => setNumPosts(e.target.value)} placeholder="e.g. 1" className={inputCls} />
                </Field>
                <Field label="Age Limit (years)" required>
                  <input value={ageLimit} onChange={(e) => setAgeLimit(e.target.value)} placeholder="e.g. 35" className={inputCls} />
                </Field>
                <Field label="Duration" required>
                  <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 6 months" className={inputCls} />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DURATIONS.map((d) => (
                      <button key={d} onClick={() => setDuration(d)}
                        className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                        {d}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Salary Range (₹/month)" required>
                  <div className="flex items-center gap-2">
                    <input value={salMin} onChange={(e) => setSalMin(e.target.value)} placeholder="Min" className={inputCls} />
                    <span className="text-gray-400 shrink-0">–</span>
                    <input value={salMax} onChange={(e) => setSalMax(e.target.value)} placeholder="Max" className={inputCls} />
                  </div>
                  <input value={salNote} onChange={(e) => setSalNote(e.target.value)} placeholder="e.g. consolidated"
                    className={inputCls + " mt-2 text-xs text-gray-500"} />
                </Field>
                <Field label="Email Subject (for applications)" required>
                  <input value={emailSub} onChange={(e) => setEmailSub(e.target.value)} placeholder="MeiTy-OCT25-ProjectAssistant/JRF" className={inputCls} />
                </Field>
                <Field label="Submission Deadline" required>
                  <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Notification Date">
                  <input type="date" value={notifDate} onChange={(e) => setNotifDate(e.target.value)} className={inputCls} />
                </Field>
              </div>
            </div>

            {/* Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Essential */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={sectionTitle}>Essential Qualifications</h3>
                {!posType ? (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    Select a position type first.
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray-400 mb-3">At least one must be satisfied:</p>
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {essBase.map((q, i) => (
                        <label key={i} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer text-sm transition
                          ${essentials.includes(q) ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}`}>
                          <input type="checkbox" checked={essentials.includes(q)} onChange={() => togEss(q)} className="mt-0.5 accent-blue-600 shrink-0" />
                          <span className="text-gray-700">{q}</span>
                        </label>
                      ))}
                      {customEssItems.map((q, i) => (
                        <label key={"c" + i} className="flex items-start gap-2 p-2 rounded-lg cursor-pointer text-sm bg-blue-50 border border-blue-200">
                          <input type="checkbox" checked onChange={() => togEss(q)} className="mt-0.5 accent-blue-600 shrink-0" />
                          <span className="text-gray-700">{q}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <input value={customEss} onChange={(e) => setCustomEss(e.target.value)} placeholder="Add custom…" className={inputCls + " text-xs"} />
                      <button onClick={() => { if (customEss.trim()) { setEssentials((p) => [...p, customEss.trim()]); setCustomEss(""); } }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 shrink-0">+</button>
                    </div>
                  </>
                )}
              </div>

              {/* Desirable */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={sectionTitle}>Desirable Qualifications</h3>
                <p className="text-xs text-gray-400 mb-3">Select all that apply:</p>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {DESIRABLE_QUALS.map((q, i) => (
                    <label key={i} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer text-sm transition
                      ${desirables.includes(q) ? "bg-green-50 border border-green-200" : "hover:bg-gray-50"}`}>
                      <input type="checkbox" checked={desirables.includes(q)} onChange={() => togDes(q)} className="mt-0.5 accent-green-600 shrink-0" />
                      <span className="text-gray-700">{q}</span>
                    </label>
                  ))}
                  {customDesItems.map((q, i) => (
                    <label key={"c" + i} className="flex items-start gap-2 p-2 rounded-lg cursor-pointer text-sm bg-green-50 border border-green-200">
                      <input type="checkbox" checked onChange={() => togDes(q)} className="mt-0.5 accent-green-600 shrink-0" />
                      <span className="text-gray-700">{q}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <input value={customDes} onChange={(e) => setCustomDes(e.target.value)} placeholder="Add custom…" className={inputCls + " text-xs"} />
                  <button onClick={() => { if (customDes.trim()) { setDesirables((p) => [...p, customDes.trim()]); setCustomDes(""); } }}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 shrink-0">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Committee */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={sectionTitle}>Selection Committee</h3>
                <div className="space-y-2 mb-3">
                  {committee.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-5 text-center font-bold">{i + 1}.</span>
                      <input value={m} onChange={(e) => setMem(i, e.target.value)}
                        placeholder={i === 0 ? "Dr. Name (Chairman)" : "Dr. Name"} className={inputCls} />
                      {i === 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold shrink-0">CHAIR</span>}
                      {i > 0 && (
                        <button onClick={() => delMem(i)} className="text-red-400 hover:text-red-600 shrink-0 text-lg leading-none">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-2 font-semibold">Quick-add:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMM_POOL.filter((s) => !committee.includes(s)).map((name, i) => (
                    <button key={i} onClick={() => setCommittee((p) => [...p, name])}
                      className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                      + {name}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCommittee((p) => [...p, ""])}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
                  + Add member
                </button>
              </div>

              {/* Terms */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className={sectionTitle}>Terms & Conditions</h3>
                <p className="text-xs text-gray-400 mb-3">All pre-selected. Uncheck any to remove.</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {STANDARD_TERMS.map((term, i) => (
                    <label key={i} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer text-xs transition
                      ${activeTerms.includes(i) ? "bg-red-50 border border-red-200" : "hover:bg-gray-50"}`}>
                      <input type="checkbox" checked={activeTerms.includes(i)} onChange={() => togTerm(i)} className="mt-0.5 accent-red-500 shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{term}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-1 font-semibold">Add custom term:</p>
                  <textarea value={customTerm} onChange={(e) => setCustomTerm(e.target.value)}
                    placeholder="Additional condition..." rows={2} className={inputCls + " resize-none text-xs"} />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className={sectionTitle}>Summary — verify before generating</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {[
                  ["Date",               reqDate    || "—"],
                  ["Project Title",      projTitle  || "—"],
                  ["Project Code",       projCode   || "—"],
                  ["Sponsoring Agency",  agency     || "—"],
                  ["PI Name",            piName     || "—"],
                  ["PI Designation",     piDesig    || "—"],
                  ["PI Email",           piEmail    || "—"],
                  ["PI Address",         piAddr     || "—"],
                  ["PI Website",         piWeb      || "—"],
                  ["Position",           posLabel],
                  ["No. of Posts",       numPosts   || "—"],
                  ["Age Limit",          ageLimit   || "—"],
                  ["Salary",             salMin && salMax ? `₹${salMin} – ₹${salMax}/month (${salNote})` : "—"],
                  ["Duration",           duration   || "—"],
                  ["Email Subject",      emailSub   || "—"],
                  ["Submission Deadline",deadline   || "—"],
                  ["Notification Date",  notifDate  || "—"],
                ].map(([k, v], i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-gray-100 text-sm">
                    <span className="w-36 text-gray-500 font-semibold shrink-0">{k}</span>
                    <span className="text-gray-800 break-words">{v}</span>
                  </div>
                ))}
              </div>

              {(essentials.length > 0 || desirables.length > 0 || committee.filter(Boolean).length > 0) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {essentials.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Essential Quals</p>
                      <ul className="list-disc list-inside space-y-1">
                        {essentials.map((q, i) => <li key={i} className="text-xs text-gray-700">{q}</li>)}
                      </ul>
                    </div>
                  )}
                  {desirables.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Desirable Quals</p>
                      <ul className="list-disc list-inside space-y-1">
                        {desirables.map((q, i) => <li key={i} className="text-xs text-gray-700">{q}</li>)}
                      </ul>
                    </div>
                  )}
                  {committee.filter(Boolean).length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Committee</p>
                      <ul className="list-disc list-inside space-y-1">
                        {committee.filter(Boolean).map((m, i) => <li key={i} className="text-xs text-gray-700">{m}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Generate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                Generate DOCX
              </button>
              <button className="py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition">
                Generate PDF
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}
            className={`px-6 py-2 rounded-lg border font-semibold text-sm transition
              ${step === 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
            ← Back
          </button>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} onClick={() => setStep(n)} className={`h-2 rounded-full cursor-pointer transition-all
                ${step === n ? "w-6 bg-blue-600" : n < step ? "w-2 bg-blue-400" : "w-2 bg-gray-300"}`} />
            ))}
          </div>
          {step < 3 ? (
            <button onClick={() => setStep((s) => Math.min(3, s + 1))}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition">
              Next →
            </button>
          ) : (
            <div className="w-24" />
          )}
        </div>

      </div>
    </div>
  );
}
