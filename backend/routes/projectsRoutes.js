import express from "express";
import CodeCreation from "../models/codeCreation.js";
const router = express.Router();
import crypto from "crypto";
import User from "../models/user.js"
import { auth } from "../middleware/auth.js";

// PROJECT CODE GENERATOR FOR RND
router.post("/project-code", async (req, res) => {
  try {
    const { department } = req.body;
    console.log(department);
    
    const year = new Date().getFullYear();

    const lastProject = await CodeCreation.findOne({
      department,
      year,
    }).sort({ sequenceNumber: -1 });

    let sequenceNumber = lastProject ? lastProject.sequenceNumber + 1 : 1;

    const paddedSeq = String(sequenceNumber).padStart(4, "0");
    const projectCode = `${year}/${department}/${paddedSeq}`;
    console.log(projectCode);
    
    await CodeCreation.create({
      department,
      year,
      sequenceNumber,
      projectCode,
    });

    res.status(201).json({ projectCode });
  } catch (err) {
    res.status(500).json({ message: "Error generating code" });
  }
});

// PROJECT CODE FORM CREATED BY RND
router.post("/", async (req, res) => {
  try {

    const {
      projectCode,
      department,
      availableFunds,
      transactionId,
      piEmpId,
      piName,
      payload,
      signature
    } = req.body;

     /* fetch RND public key  */

    const rndUser = await User.findOne({ role: "RND" });

    if (!rndUser) {
      return res.status(404).json({ message: "RND user not found" });
    }

    const publicKey = rndUser.publicKey;


    /* verify signature  */

    const verify = crypto.createVerify("RSA-SHA256");

    verify.update(payload);
    verify.end();

    const isValid = verify.verify(
      publicKey,
      Buffer.from(signature, "base64")
    );

    if (!isValid) {
      return res.status(401).json({
        message: "Signature verification failed"
      });
    }

    // Insertion in DB
const existingProject = await CodeCreation.findOne({ projectCode });

if (!existingProject) {
  return res.status(404).json({ message: "Project not found" });
}

// update fields
existingProject.availableFunds = availableFunds;
existingProject.transactionId = transactionId;
existingProject.piEmpId = piEmpId;
existingProject.piName = piName;
existingProject.signature = signature;
existingProject.signedBy = rndUser.role;

await existingProject.save();
    res.status(201).json({
      message: "Project created successfully",
      project:existingProject
      // codeCreation
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// // ================== PI: GET PROJECTS ==================
router.get("/pi-projects", auth, async (req, res) => {
  try {
    console.log("Route hit");

    const userId = req.user.id; // coming from JWT
    console.log("User ID:", userId);

    const projects = await CodeCreation.find({
      piEmpId: userId   // ⚠️ IMPORTANT: must match DB field
    }).select("projectCode availableFunds transactionId piName");

    console.log("Projects:", projects);

    res.json(projects);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

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