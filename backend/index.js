import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, User} from "./db.js";
import { Project} from "./db.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder setup for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });


app.get("/",(req,res)=>{
    res.send("hii")
});

//  LOGIN ROUTE
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️ Find user in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2️ Compare password with hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // 3️ Success → send minimal user info
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// project creation
app.post("/project", upload.single("attachment"), async (req, res) => {
  try {
    const form = req.body;
    const file = req.file;
console.log(form);
console.log(file);

    const newProject = new Project({
      projectId: form.projectId,
      title: form.title,
      piName: form.piName,
      department: form.department,
      totalFundReceived: form.totalFundReceived,
      bifurcationYear: form.bifurcationYear,
      divisionHeads: JSON.parse(form.divisionHeads),
      attachment: file ? file.path : "No file",
      status: "Sent to R&D",
    });

    await newProject.save();
    res.status(201).json({ message: "Project Created successfully", newProject });
  } catch (err) {
    console.error("Project Creation failed:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all projects
app.get("/project", async (req, res) => {
  try {
    const projects = await Project.find().sort({ submittedAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// search project by id
app.get("/project/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id); // or findOne({ projectId: req.params.id })
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all R&D projects
app.get("/projects/rnd", async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { status: "Pending" },
        { status: "Sent to R&D" },
        { status: "Under Review" },
        { status: { $regex: "Dean", $options: "i" } },
      ],
    }).sort({ submittedAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching R&D projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

//  Approve / Reject by R&D
app.put("/project/:id/approve", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "Approved by R&D" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Project not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error approving project:", err);
    res.status(500).json({ error: "Failed to approve project" });
  }
});

app.put("/project/:id/reject", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected by R&D" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Project not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error rejecting project:", err);
    res.status(500).json({ error: "Failed to reject project" });
  }
});

// start server
app.listen(8000,()=>{
    console.log("listening");
    
})


// import { Project } from "./db.js";

// Watch the Project collection for any changes
// const changeStream = Project.watch();

// Listen for any changes in the collection
// changeStream.on("change", (change) => {
//   console.log("⚠️ Change detected in Project collection:");
//   console.log(JSON.stringify(change, null, 2));
// });
