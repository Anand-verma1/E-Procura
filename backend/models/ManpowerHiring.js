import mongoose from "mongoose";

const manpowerHiringSchema = new mongoose.Schema({
  projectId:   { type: mongoose.Schema.Types.ObjectId, ref: "CodeCreation" },
  projectCode: String,
  projectTitle: String,
  reqDate:     String,
  agency:      String,

  piName:  String,
  piDesig: String,
  piAddr:  String,
  piEmail: String,
  piWeb:   String,

  posType:   String,
  posLabel:  String,
  numPosts:  Number,
  ageLimit:  String,
  salMin:    String,
  salMax:    String,
  salNote:   String,
  duration:  String,
  deadline:  String,
  notifDate: String,
  emailSub:  String,

  essentials: [String],
  desirables: [String],

  committee:   [String],
  customTerms: [String],

  appFormPath:         String,
  appFormOriginalName: String,

  signature:   String,
  submittedBy: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ManpowerHiring", manpowerHiringSchema);
