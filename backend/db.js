import mongoose from "mongoose";

// user schema
const userSchema = new mongoose.Schema({
    email:{
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true },
  password: { 
    type: String, 
    required: true
 },
  role: { 
    type: String, 
    enum: ["PI", "RND", "DEAN"], 
    required: true
 },
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});
//user model  - collection name
export const User = new mongoose.model("User",userSchema);

// Project Schema 
const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  piName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: "CSE",
  },
  totalFundReceived: {
    type: Number,
    required: true,
  },
  bifurcationYear: {
    type: String,
    required: true,
  },
  divisionHeads: {
    "Manpower (including Interns)": { type: Number, required: true },
    Equipment: { type: Number, required: true },
    "Consumables/Contingency/Travel": { type: Number, required: true },
    "Bootcamps/Events": { type: Number, required: true },
    Overhead: { type: Number, required: true },
  },
  attachment: {
    type: String, // File path 
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Under Review",
      "Sent to R&D",
      "Approved by R&D",
      "Rejected by R&D"
    ],
    default: "Pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});
// projects model
export const Project = mongoose.model("Project", projectSchema);


// mongodb connections
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/procureDB");
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("DB connection failed");
  }
};

connectDB();