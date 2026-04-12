import mongoose from "mongoose";

const codeCreationSchema = new mongoose.Schema({
  projectCode: {
    type: String,
    unique: true
  },
  year: Number,
  department: String,
  sequenceNumber: Number,

  availableFunds: Number,
  transactionId: String,

  piEmpId: String,
  piName: String,

  signature:String,
  signedBy:String,
  status: {
    type: String,
    default: "Sent to PI"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CodeCreation = mongoose.model("CodeCreation", codeCreationSchema);
export default CodeCreation;