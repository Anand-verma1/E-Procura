import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  role: {
    type: String,
    enum: ["RND", "DEAN"],
    required: true
  },
  decision: {
    type: String,
    enum: ["approve", "reject"],
    required: true
  },
  signature: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Approval", approvalSchema);
