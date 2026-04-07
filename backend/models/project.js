import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    title: { type: String, required: true },

    department: { type: String, default: "CSE" },
    piName: { type: String, required: true },

    totalFundReceived: { type: Number, required: true },
    bifurcationYear: { type: Number, required: true },

    divisionHeads: {
      "Manpower (including Interns)": { type: Number, required: true },
      Equipment: { type: Number, required: true },
      "Consumables/Contingency/Travel": { type: Number, required: true },
      "Bootcamps/Events": { type: Number, required: true },
      Overhead: { type: Number, required: true },
    },

    // 📎 FILE INFO (not actual file)
    attachmentPath: { type: String, required: true },
    attachmentOriginalName: { type: String },
    pdfHash: { type: String, required: true },

    // 👤 WHO SUBMITTED
    submittedBy: { type: String, required: true }, 

    // 🔄 WORKFLOW STATE
    status: {
      type: String,
      enum: [
    "pending_rnd",        
    "rejected_by_rnd",    
    "pending_dean",       
    "rejected_by_dean",   
    "approved"            
    ],
      default: "pending_rnd",
    },

        // DIGITAL SIGNATURE
    signaturePI: { type: String, required: true },

    approvedBy: { type: String },
    approvedAt: { type: Date },

  rndDecision: {
    action: { type: String, enum: ["approve", "reject"] },
    signature: String,
    decidedBy: String,
    decidedAt: Date
  },

  deanDecision: {
    action: { type: String, enum: ["approve", "reject"] },
    signature: String,
    decidedBy: String,
    decidedAt: Date
  }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
