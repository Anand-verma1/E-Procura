import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  employeeId: String,
  department: String,
  role: { type: String, enum: ["PI", "RND", "DEAN"], required: true },
  password: String,
  publicKey: String,  
});

export default mongoose.model("User", userSchema);
