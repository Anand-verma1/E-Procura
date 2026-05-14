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
  "Android app development (Java, Kotlin, etc.)", "Android app security tools (MobSF, ADB, Frida, etc.)",
  "Full-Stack web development (ReactJS, NodeJS, Express, PHP, MongoDB)",
  "Blockchain (Ethereum (Quorum/Besu), Hyperledger Fabric)", "Smart contracts (Solidity, Chaincode)",
  "Advanced Cryptography (ZKP, MPC, Advanced types of signature schemes, etc.)",
  "Web3 security tools (Slither, MythX, zk-SNARKs, etc.)", "Penetration testing (e.g. Burp suite)",
  "APK testing (e.g. Frida)", "Scalable backends (Node.js, Python)",
  "Network security issues (VLAN, MAC, DHCP, etc.)", "Machine Learning / Deep Learning",
  "Data Science and Analytics", "Cloud computing (AWS, GCP, Azure)",
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
  "If the number of candidates appearing for the interview is large, the selection committee may decide to restrict the number of candidates for the interview to a reasonable limit after considering qualifications and experience over and above the minimum prescribed in the advertisement.",
  "The appointment of the candidate will be governed by the terms and conditions of the Institute/Funding agency particularly applicable to the said project as and when required.",
  "The selected candidate will have to join duty immediately on receipt of the offer.",
  "The fellowship may be terminated with a 30-day notice before completion of the tenure if performance till date is not deemed satisfactory.",
  "IIT Bhilai, based on the performance of the candidates, reserves the right to fill or not to fill any or all the posts.",
];

const baseInput = { width: "100%", boxSizing: "border-box", border: "1.5px solid #E5E7EB", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", color: "#111827", outline: "none", background: "#FAFAFA", transition: "border-color .15s" };

function FInput({ value, onChange, placeholder, type = "text" }) {
  const [f, setF] = useState(false);
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...baseInput, borderColor: f ? "#6366F1" : "#E5E7EB" }} onFocus={() => setF(true)} onBlur={() => setF(false)} />;
}
function FArea({ value, onChange, placeholder, rows = 2 }) {
  const [f, setF] = useState(false);
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...baseInput, resize: "vertical", borderColor: f ? "#6366F1" : "#E5E7EB" }} onFocus={() => setF(true)} onBlur={() => setF(false)} />;
}
function Tags({ items, onPick }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
      {items.map((t, i) => (
        <button key={i} onClick={() => onPick(t)}
          style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: "5px", padding: "2px 8px", fontSize: "11px", color: "#4338CA", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .12s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#E0E7FF"; e.currentTarget.style.borderColor = "#6366F1"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#EEF2FF"; e.currentTarget.style.borderColor = "#C7D2FE"; }}>
          {t}
        </button>
      ))}
    </div>
  );
}
function FL({ label, required, hint, children, span2 }) {
  return (
    <div style={{ marginBottom: "13px", gridColumn: span2 ? "span 2" : "span 1" }}>
      <label style={{ display: "block", fontWeight: "600", fontSize: "12px", color: "#374151", marginBottom: "3px", fontFamily: "'DM Sans',sans-serif" }}>
        {label}{required && <span style={{ color: "#EF4444" }}> *</span>}
      </label>
      {hint && <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 4px" }}>{hint}</p>}
      {children}
    </div>
  );
}
function CardSection({ title, letter, accent = "#F5F3FF", dotColor = "#6366F1", children }) {
  return (
    <div style={{ border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
      <div style={{ background: accent, borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: "9px" }}>
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: dotColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>{letter}</div>
        <span style={{ fontWeight: "700", fontSize: "13.5px", color: "#1F2937", fontFamily: "'DM Sans',sans-serif" }}>{title}</span>
      </div>
      <div style={{ padding: "16px 18px", background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>{children}</div>
      </div>
    </div>
  );
}
function ChkBox({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: "7px", padding: "6px 9px", borderRadius: "7px", cursor: "pointer", background: checked ? "#F5F3FF" : "transparent", border: `1px solid ${checked ? "#C7D2FE" : "transparent"}`, transition: "all .12s", fontSize: "12px", color: "#374151", fontFamily: "'DM Sans',sans-serif", lineHeight: "1.5", marginBottom: "2px" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ marginTop: "2px", accentColor: "#6366F1", width: "13px", height: "13px", flexShrink: 0 }} />
      {label}
    </label>
  );
}

function StepBar({ step }) {
  const labels = ["Project & PI", "Position & Qualifications", "Review & Submit"];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px 32px 12px", gap: "0" }}>
      {labels.map((t, i) => {
        const n = i + 1, done = step > n, active = step === n;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "110px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", background: done || active ? "#6366F1" : "#F3F4F6", color: done || active ? "#fff" : "#9CA3AF", border: `2px solid ${done || active ? "#6366F1" : "#E5E7EB"}`, transition: "all .25s" }}>
                {done ? "✓" : n}
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: active ? "700" : "500", color: active ? "#6366F1" : "#9CA3AF", fontFamily: "'DM Sans',sans-serif", textAlign: "center", lineHeight: "1.3" }}>{t}</span>
            </div>
            {i < labels.length - 1 && <div style={{ width: "70px", height: "2px", background: step > n ? "#6366F1" : "#E5E7EB", margin: "0 4px", marginBottom: "16px", transition: "background .3s", flexShrink: 0 }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function ManpowerHiringForm() {
  const [step, setStep] = useState(1);

  const [reqDate, setReqDate]   = useState("");
  const [projTitle, setProjTitle] = useState("");
  const [projCode, setProjCode]   = useState("");
  const [agency, setAgency]       = useState("");
  const [piName, setPiName]       = useState("");
  const [piDesig, setPiDesig]     = useState("");
  const [piAddr, setPiAddr]       = useState("");
  const [piEmail, setPiEmail]     = useState("");
  const [piWeb, setPiWeb]         = useState("");

  const [posType, setPosType]       = useState("");
  const [numPosts, setNumPosts]     = useState("");
  const [ageLimit, setAgeLimit]     = useState("");
  const [salMin, setSalMin]         = useState("");
  const [salMax, setSalMax]         = useState("");
  const [salNote, setSalNote]       = useState("");
  const [duration, setDuration]     = useState("");
  const [deadline, setDeadline]     = useState("");
  const [notifDate, setNotifDate]   = useState("");
  const [emailSub, setEmailSub]     = useState("");
  const [essentials, setEssentials] = useState([]);
  const [customEss, setCustomEss]   = useState("");
  const [desirables, setDesirables] = useState([]);
  const [customDes, setCustomDes]   = useState("");

  const [committee, setCommittee]     = useState([""]);
  const [activeTerms, setActiveTerms] = useState(STANDARD_TERMS.map((_, i) => i));
  const [customTerm, setCustomTerm]   = useState("");

  const fillPI = p => { setPiName(p.name); setPiDesig(p.designation); setPiAddr(p.address); setPiEmail(p.email); setPiWeb(p.website); };

  const pickPos = v => {
    setPosType(v); setEssentials([]);
    const s = SALARY_MAP[v]; if (s) { setSalMin(s.min); setSalMax(s.max); setSalNote(s.note); }
    setAgeLimit(AGE_MAP[v] || ""); setEmailSub(SUBJECT_MAP[v] || "");
  };

  const togEss  = q => setEssentials(p => p.includes(q) ? p.filter(x => x !== q) : [...p, q]);
  const togDes  = q => setDesirables(p => p.includes(q) ? p.filter(x => x !== q) : [...p, q]);
  const togTerm = i => setActiveTerms(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  const setMem  = (i, v) => setCommittee(p => { const c = [...p]; c[i] = v; return c; });
  const delMem  = i => setCommittee(p => p.filter((_, j) => j !== i));

  const posLabel       = POSITION_TYPES.find(p => p.value === posType)?.label || "—";
  const essBase        = posType ? ESSENTIAL_QUALS[posType] : [];
  const customEssItems = essentials.filter(q => !essBase.includes(q));
  const customDesItems = desirables.filter(q => !DESIRABLE_QUALS.includes(q));

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1.5px solid #E5E7EB", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#6366F1", letterSpacing: ".1em", textTransform: "uppercase" }}>IIT Bhilai — R&D Office</div>
          <h1 style={{ margin: "1px 0 0", fontSize: "19px", fontWeight: "400", color: "#111827", fontFamily: "'DM Serif Display',serif" }}>Manpower Hiring Request</h1>
        </div>
        <div style={{ background: "#EEF2FF", borderRadius: "8px", padding: "7px 14px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", color: "#6366F1", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".05em" }}>Step {step} of 3</div>
          <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#4338CA" }}>
            {step === 1 ? "Project & PI" : step === 2 ? "Position & Qualifications" : "Review & Submit"}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "3px", background: "#E5E7EB" }}>
        <div style={{ height: "100%", width: `${(step / 3) * 100}%`, background: "linear-gradient(90deg,#6366F1,#818CF8)", transition: "width .4s ease" }} />
      </div>

      <StepBar step={step} />

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "0 20px 40px" }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <CardSection title="Project Information" letter="A" accent="#F0F9FF" dotColor="#0284C7">
                <FL label="Date of Request" required>
                  <FInput type="date" value={reqDate} onChange={setReqDate} />
                </FL>
                <FL label="Project Code">
                  <FInput value={projCode} onChange={setProjCode} placeholder="e.g. 2019500" />
                </FL>
                <FL label="Project Title" required span2>
                  <FArea value={projTitle} onChange={setProjTitle} placeholder='"FinTech Security with (or without) Blockchain"' rows={2} />
                  <Tags items={["FinTech Security with (or without) Blockchain", "Machine Learning for Healthcare", "Cybersecurity and Network Analysis"]} onPick={setProjTitle} />
                </FL>
                <FL label="Sponsoring Agency" required span2>
                  <FInput value={agency} onChange={setAgency} placeholder="e.g. MeitY" />
                  <Tags items={AGENCIES} onPick={setAgency} />
                </FL>
              </CardSection>
            </div>

            <div>
              <CardSection title="Principal Investigator" letter="B" accent="#FFF7ED" dotColor="#D97706">
                <div style={{ gridColumn: "span 2", marginBottom: "12px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: "600", color: "#92400E" }}>Quick-fill a known PI:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {PI_PRESETS.map((pi, i) => (
                      <button key={i} onClick={() => fillPI(pi)}
                        style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "7px", padding: "5px 13px", fontSize: "12px", color: "#92400E", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: "600", transition: "all .12s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#FDE68A"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#FEF3C7"; }}>
                        {pi.name}
                      </button>
                    ))}
                  </div>
                </div>
                <FL label="Full Name" required>
                  <FInput value={piName} onChange={setPiName} placeholder="Dr. Full Name" />
                </FL>
                <FL label="Email ID" required>
                  <FInput type="email" value={piEmail} onChange={setPiEmail} placeholder="name@iitbhilai.ac.in" />
                </FL>
                <FL label="Designation" required span2>
                  <FInput value={piDesig} onChange={setPiDesig} placeholder="e.g. Associate Professor in Department of CSE" />
                </FL>
                <FL label="Office Address" span2>
                  <FArea value={piAddr} onChange={setPiAddr} placeholder="Room, Building, IIT Bhilai, ..." rows={2} />
                </FL>
                <FL label="Website" span2>
                  <FInput value={piWeb} onChange={setPiWeb} placeholder="e.g. yourname.github.io" />
                </FL>
              </CardSection>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <CardSection title="Position & Application Details" letter="C" accent="#F0FDF4" dotColor="#10B981">
              <div style={{ gridColumn: "span 2", marginBottom: "14px" }}>
                <p style={{ margin: "0 0 8px", fontSize: "11.5px", fontWeight: "600", color: "#374151" }}>Position type <span style={{ color: "#EF4444" }}>*</span></p>
                <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#9CA3AF" }}>Salary, age limit and email subject auto-fill when you pick one.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {POSITION_TYPES.map(p => (
                    <label key={p.value} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 13px", border: `1.5px solid ${posType === p.value ? "#6366F1" : "#E5E7EB"}`, borderRadius: "8px", cursor: "pointer", fontSize: "12.5px", background: posType === p.value ? "#EEF2FF" : "#FAFAFA", color: posType === p.value ? "#4338CA" : "#374151", fontWeight: posType === p.value ? "700" : "400", transition: "all .12s", fontFamily: "'DM Sans',sans-serif" }}>
                      <input type="radio" name="postype" checked={posType === p.value} onChange={() => pickPos(p.value)} style={{ accentColor: "#6366F1" }} />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <FL label="Number of Posts" required>
                <FInput value={numPosts} onChange={setNumPosts} placeholder="e.g. 1" type="number" />
                <Tags items={["1", "2", "3"]} onPick={setNumPosts} />
              </FL>
              <FL label="Age Limit (years)" required>
                <FInput value={ageLimit} onChange={setAgeLimit} placeholder="e.g. 35" />
                {posType && <Tags items={[AGE_MAP[posType]]} onPick={setAgeLimit} />}
              </FL>
              <FL label="Duration" required>
                <FInput value={duration} onChange={setDuration} placeholder="e.g. 6 months" />
                <Tags items={DURATIONS} onPick={setDuration} />
              </FL>
              <FL label="Salary Range (₹/month)" required>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <FInput value={salMin} onChange={setSalMin} placeholder="Min" />
                  <span style={{ color: "#9CA3AF", flexShrink: 0, fontSize: "13px" }}>–</span>
                  <FInput value={salMax} onChange={setSalMax} placeholder="Max" />
                </div>
                <input value={salNote} onChange={e => setSalNote(e.target.value)} placeholder="e.g. consolidated" style={{ ...baseInput, marginTop: "5px", fontSize: "11.5px", color: "#6B7280" }} />
              </FL>
              <FL label="Email Subject (for applications)" required>
                <FInput value={emailSub} onChange={setEmailSub} placeholder="MeiTy-OCT25-ProjectAssistant/JRF" />
                {posType && <Tags items={[SUBJECT_MAP[posType]]} onPick={setEmailSub} />}
              </FL>
              <FL label="Submission Deadline" required>
                <FInput type="datetime-local" value={deadline} onChange={setDeadline} />
              </FL>
              <FL label="Notification Date">
                <FInput type="date" value={notifDate} onChange={setNotifDate} />
              </FL>
            </CardSection>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Essential */}
              <div style={{ border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "#FFF7ED", borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#F59E0B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>D</div>
                  <span style={{ fontWeight: "700", fontSize: "13.5px", color: "#1F2937", fontFamily: "'DM Sans',sans-serif" }}>Essential Qualifications</span>
                </div>
                <div style={{ padding: "13px 15px", background: "#fff" }}>
                  {!posType
                    ? <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "7px", padding: "9px 12px", fontSize: "12px", color: "#92400E" }}>Select a position type above first.</div>
                    : <>
                      <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 8px" }}>One of the following must be satisfied:</p>
                      {essBase.map((q, i) => <ChkBox key={i} label={q} checked={essentials.includes(q)} onChange={() => togEss(q)} />)}
                      {customEssItems.map((q, i) => <ChkBox key={"c" + i} label={q} checked={true} onChange={() => togEss(q)} />)}
                    </>
                  }
                  <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                    <input value={customEss} onChange={e => setCustomEss(e.target.value)} placeholder="Add custom…" style={{ ...baseInput, flex: 1, fontSize: "11.5px" }} />
                    <button onClick={() => { if (customEss.trim()) { setEssentials(p => [...p, customEss.trim()]); setCustomEss(""); } }} style={{ padding: "6px 10px", background: "#F59E0B", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontWeight: "700", flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>+</button>
                  </div>
                </div>
              </div>

              {/* Desirable */}
              <div style={{ border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "#F0FDF4", borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>E</div>
                  <span style={{ fontWeight: "700", fontSize: "13.5px", color: "#1F2937", fontFamily: "'DM Sans',sans-serif" }}>Desirable Qualifications</span>
                </div>
                <div style={{ padding: "13px 15px", background: "#fff", maxHeight: "400px", overflowY: "auto" }}>
                  <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 8px" }}>Select all that apply (one or more):</p>
                  {DESIRABLE_QUALS.map((q, i) => <ChkBox key={i} label={q} checked={desirables.includes(q)} onChange={() => togDes(q)} />)}
                  {customDesItems.map((q, i) => <ChkBox key={"c" + i} label={q} checked={true} onChange={() => togDes(q)} />)}
                  <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                    <input value={customDes} onChange={e => setCustomDes(e.target.value)} placeholder="Add custom…" style={{ ...baseInput, flex: 1, fontSize: "11.5px" }} />
                    <button onClick={() => { if (customDes.trim()) { setDesirables(p => [...p, customDes.trim()]); setCustomDes(""); } }} style={{ padding: "6px 10px", background: "#10B981", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontWeight: "700", flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Committee */}
              <div style={{ border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "#EEF2FF", borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#6366F1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>F</div>
                  <span style={{ fontWeight: "700", fontSize: "13.5px", color: "#1F2937", fontFamily: "'DM Sans',sans-serif" }}>Selection Committee</span>
                </div>
                <div style={{ padding: "14px 16px", background: "#fff" }}>
                  {committee.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "7px", alignItems: "center" }}>
                      <span style={{ width: "18px", fontSize: "11px", color: "#9CA3AF", fontWeight: "700", flexShrink: 0, textAlign: "center" }}>{i + 1}.</span>
                      <input value={m} onChange={e => setMem(i, e.target.value)} placeholder={i === 0 ? "Dr. Name (Chairman)" : "Dr. Name"}
                        style={{ ...baseInput, flex: 1, fontSize: "12.5px" }} />
                      {i === 0 && <span style={{ fontSize: "9px", background: "#EEF2FF", color: "#6366F1", padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap", flexShrink: 0, fontWeight: "700" }}>CHAIR</span>}
                      {i > 0 && <button onClick={() => delMem(i)} style={{ background: "none", border: "1px solid #FECACA", borderRadius: "5px", color: "#EF4444", padding: "3px 8px", cursor: "pointer", fontSize: "11px", flexShrink: 0 }}>✕</button>}
                    </div>
                  ))}
                  <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "8px 0 6px", fontWeight: "600" }}>Quick-add:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
                    {COMM_POOL.filter(s => !committee.includes(s)).map((name, i) => (
                      <button key={i} onClick={() => setCommittee(p => [...p, name])}
                        style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: "5px", padding: "3px 8px", fontSize: "11px", color: "#4338CA", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .12s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#E0E7FF"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#EEF2FF"; }}>
                        + {name}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setCommittee(p => [...p, ""])} style={{ width: "100%", padding: "7px", background: "transparent", border: "1.5px dashed #C7D2FE", borderRadius: "7px", color: "#6366F1", cursor: "pointer", fontSize: "12px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif" }}>
                    + Add member
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div style={{ border: "1.5px solid #E5E7EB", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "#FFF1F2", borderBottom: "1px solid #E5E7EB", padding: "10px 16px", display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#F43F5E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>G</div>
                  <span style={{ fontWeight: "700", fontSize: "13.5px", color: "#1F2937", fontFamily: "'DM Sans',sans-serif" }}>Terms & Conditions</span>
                </div>
                <div style={{ padding: "12px 15px", background: "#fff", maxHeight: "360px", overflowY: "auto" }}>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 9px" }}>All standard terms pre-selected. Uncheck any to remove.</p>
                  {STANDARD_TERMS.map((term, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px", padding: "6px 9px", borderRadius: "6px", cursor: "pointer", background: activeTerms.includes(i) ? "#FFF1F2" : "transparent", border: `1px solid ${activeTerms.includes(i) ? "#FECDD3" : "transparent"}`, transition: "all .12s", fontSize: "11.5px", color: "#374151", fontFamily: "'DM Sans',sans-serif", lineHeight: "1.5", marginBottom: "3px" }}>
                      <input type="checkbox" checked={activeTerms.includes(i)} onChange={() => togTerm(i)} style={{ marginTop: "2px", accentColor: "#F43F5E", width: "13px", height: "13px", flexShrink: 0 }} />
                      {term}
                    </label>
                  ))}
                  <div style={{ marginTop: "10px" }}>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 5px", fontWeight: "600" }}>Add custom term:</p>
                    <FArea value={customTerm} onChange={setCustomTerm} placeholder="Additional condition..." rows={2} />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ border: "1.5px solid #BBF7D0", borderRadius: "12px", overflow: "hidden", marginTop: "20px" }}>
              <div style={{ background: "#F0FDF4", borderBottom: "1px solid #BBF7D0", padding: "10px 16px", display: "flex", alignItems: "center", gap: "9px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>H</div>
                <span style={{ fontWeight: "700", fontSize: "13.5px", color: "#166534", fontFamily: "'DM Sans',sans-serif" }}>Full Summary — verify before generating</span>
              </div>
              <div style={{ padding: "18px 20px", background: "#fff" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
                  {[
                    ["Date", reqDate || "—"],
                    ["Project Title", projTitle || "—"],
                    ["Project Code", projCode || "—"],
                    ["Sponsoring Agency", agency || "—"],
                    ["PI Name", piName || "—"],
                    ["PI Designation", piDesig || "—"],
                    ["PI Email", piEmail || "—"],
                    ["PI Address", piAddr || "—"],
                    ["PI Website", piWeb || "—"],
                    ["Position", posLabel],
                    ["No. of Posts", numPosts || "—"],
                    ["Age Limit", ageLimit || "—"],
                    ["Salary", salMin && salMax ? `₹${salMin} – ₹${salMax}/month (${salNote})` : "—"],
                    ["Duration", duration || "—"],
                    ["Email Subject", emailSub || "—"],
                    ["Submission Deadline", deadline || "—"],
                    ["Notification Date", notifDate || "—"],
                  ].map(([k, v], i) => (
                    <div key={i} style={{ display: "flex", borderBottom: "1px solid #F9FAFB", padding: "7px 0", gap: "10px" }}>
                      <span style={{ minWidth: "130px", fontSize: "11.5px", color: "#6B7280", fontWeight: "600", flexShrink: 0 }}>{k}</span>
                      <span style={{ fontSize: "12px", color: "#111827", wordBreak: "break-word" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {(essentials.length > 0 || desirables.length > 0 || committee.filter(Boolean).length > 0) && (
                  <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    {essentials.length > 0 && (
                      <div>
                        <p style={{ fontSize: "11.5px", fontWeight: "700", color: "#6B7280", margin: "0 0 5px" }}>Essential Quals</p>
                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#374151", lineHeight: "1.8" }}>
                          {essentials.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    {desirables.length > 0 && (
                      <div>
                        <p style={{ fontSize: "11.5px", fontWeight: "700", color: "#6B7280", margin: "0 0 5px" }}>Desirable Quals</p>
                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#374151", lineHeight: "1.8" }}>
                          {desirables.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    {committee.filter(Boolean).length > 0 && (
                      <div>
                        <p style={{ fontSize: "11.5px", fontWeight: "700", color: "#6B7280", margin: "0 0 5px" }}>Committee</p>
                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#374151", lineHeight: "1.8" }}>
                          {committee.filter(Boolean).map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Generate buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "18px" }}>
              <button style={{ padding: "13px", background: "#6366F1", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "opacity .15s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Generate DOCX
              </button>
              <button style={{ padding: "13px", background: "transparent", color: "#6366F1", border: "1.5px solid #6366F1", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#EEF2FF"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                Generate PDF
              </button>
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "22px" }}>
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            style={{ padding: "10px 22px", background: "transparent", border: "1.5px solid #E5E7EB", borderRadius: "8px", color: step === 1 ? "#D1D5DB" : "#374151", cursor: step === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif" }}>
            Back
          </button>
          <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            {[1, 2, 3].map(n => (
              <div key={n} onClick={() => setStep(n)} style={{ width: step === n ? "26px" : "8px", height: "8px", borderRadius: "4px", background: n <= step ? "#6366F1" : "#E5E7EB", cursor: "pointer", transition: "all .2s" }} />
            ))}
          </div>
          {step < 3
            ? <button onClick={() => setStep(s => Math.min(3, s + 1))} style={{ padding: "10px 22px", background: "#6366F1", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "'DM Sans',sans-serif" }}>
              Next →
            </button>
            : <div style={{ width: "90px" }} />
          }
        </div>
      </div>
    </div>
  );
}
