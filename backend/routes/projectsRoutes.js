import express from "express";
const router = express.Router();
import { auth } from "../middleware/auth.js";
import { generateProjectCode, createProject,getProjects, getPIList  } from "./controllers/projectRoutesController.js";

// Generate Empld - PI List for rnd form
router.get("/pi-list",getPIList);

// Generate Poject code by RND
router.post("/project-code", generateProjectCode );

// PROJECT CODE FORM CREATED BY RND
router.post("/", createProject);

// PI: GET PROJECTS 
router.get("/", auth(["PI"]), getProjects);

// // ================== GET ALL PROJECTS ==================
// router.get("/", async (req, res) => {
//   try {
//     const projects = await Project.find().sort({ submittedAt: -1 });
//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching projects" });
//   }
// });


// // ================== GET SINGLE PROJECT ==================
// router.get("/:id", async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching project" });
//   }
// });


// // ================== UPDATE PROJECT (PI) ==================
// router.put("/:id", async (req, res) => {
//   try {
//     const updated = await Project.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating project" });
//   }
// });


// // ================== SIGN PROJECT (PI) ==================
// router.post("/:id/sign", async (req, res) => {
//   try {
//     const { signature, data } = req.body;

//     // hash of data
//     const formHash = crypto
//       .createHash("sha256")
//       .update(JSON.stringify(data))
//       .digest("hex");

//     const updated = await Project.findByIdAndUpdate(
//       req.params.id,
//       {
//         signature,
//         formHash,
//         status: "Sent to R&D",
//       },
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error signing project" });
//   }
// });


// // ================== RND: GET PROJECTS ==================
// router.get("/rnd", async (req, res) => {
//   try {
//     const projects = await Project.find({
//       status: "Sent to R&D",
//     });

//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching RND projects" });
//   }
// });


// // ================== APPROVE ==================
// router.put("/:id/approve", async (req, res) => {
//   try {
//     const updated = await Project.findByIdAndUpdate(
//       req.params.id,
//       { status: "Approved by R&D" },
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error approving" });
//   }
// });


// // ================== REJECT ==================
// router.put("/:id/reject", async (req, res) => {
//   try {
//     const updated = await Project.findByIdAndUpdate(
//       req.params.id,
//       { status: "Rejected by R&D" },
//       { new: true }
//     );

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error rejecting" });
//   }
// });


// Get all projects created by RND
// router.get("/pi-projects/:piEmpId", async (req, res) => {
//   try {
//     const { piEmpId } = req.params;

//     const projects = await CodeCreation.find({
//       piEmpId: piEmpId
//     }).select("projectCode availableFunds transactionId piName");

//     res.json(projects);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

export default router