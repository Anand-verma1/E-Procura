import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import connectDB from "./db.js";
import User from "./models/user.js";
import Purchase from "./models/Purchase.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Project from "./models/project.js";
import { upload } from "./middleware/upload.js";
import { auth } from "./middleware/auth.js";
import fs from "fs"
import puppeteer from "puppeteer";
import projectRoutes from "./routes/projectsRoutes.js"


const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// connect to DB
connectDB();

// SIGNUP API
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, employeeId, department, role, password } = req.body;

    // check existing email
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      fullName,
      email,
      employeeId,
      department,
      role,
      password: hashedPassword,
    });

    res.json({ success: true, userId: user._id });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ⬇️ Save Public Key After Key Generation
app.post("/api/save-public-key", async (req, res) => {
   console.log("Incoming request body:");
    console.log(req.body);
  try {
    const { email, publicKey } = req.body;

    if (!email || !publicKey) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { publicKey },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Public key saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Login Route ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== role)
      return res.status(403).json({ message: "Role mismatch" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role.toUpperCase(), email:user.email,employeeId:user.employeeId},
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------
// Project APIs
// -----------------

// Submit signed project form
app.post("/project/submit",auth(["PI"]), upload.single("attachment"), async (req, res) => {
  try {

    if (!req.body.formData) return res.status(400).json({ msg: "formData missing" });
    if (!req.body.signature) return res.status(400).json({ msg: "signature missing" });
    if (!req.file) return res.status(400).json({ msg: "attachment missing" });

    const parsedForm = JSON.parse(req.body.formData);

    const email = req.user.email; // pi email for auth

    const user = await User.findOne({ email });
    if (!user || !user.publicKey)
      return res.status(404).json({ msg: "Public key not found" });

    // Verify  pi signature
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(JSON.stringify(parsedForm));
    verify.end();

    const isValid = verify.verify(
      user.publicKey,
      Buffer.from(req.body.signature, "base64")
    );

    if (!isValid)
      return res.status(400).json({ msg: "Signature verification failed" });

    // ---- Hash uploaded PDF ----
const fileBuffer = fs.readFileSync(req.file.path);

const backendPdfHash = crypto
  .createHash("sha256")
  .update(fileBuffer)
  .digest("hex");

// Compare with frontend hash
if (parsedForm.pdfHash !== backendPdfHash) {
  return res.status(400).json({ msg: "PDF tampered or mismatch" });
}

    const project = await Project.create({
      ...parsedForm,
      signaturePI: req.body.signature,
      submittedBy: email,
      attachmentPath: req.file.path,
      attachmentOriginalName: req.file.originalname,
      status: "pending_rnd",
    });
console.log("✅ Project saved successfully:", project._id);
    res.json({ success: true, projectId: project._id });
  } catch (err) {
    console.error("db"+err);
    res.status(500).json({ msg: "Server error" });
  }
});



// Get all pending projects (for RND/Dean dashboard)
app.get("/project/pi",auth(["PI"]), async (req, res) => {
  try {
    const email = req.user.email;

    const projects = await Project.find({ submittedBy: email }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid token" });
  }
});

// RND dashboard
app.get("/project/rnd", auth(["RND"]), async (req, res) => {
  const projects = await Project.find({ status: "pending_rnd" })
    .sort({ createdAt: -1 });

  res.json(projects);
});


// dean dashboard api
app.post(
  "/project/rnd-action/:id",
  auth(["RND"]),
  async (req, res) => {
    try {
      const { action, signature } = req.body;
      if (!["approve", "reject"].includes(action))
        return res.status(400).json({ msg: "Invalid action" });

      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ msg: "Project not found" });

      const rndUser = await User.findOne({ email: req.user.email });
      if (!rndUser?.publicKey)
        return res.status(404).json({ msg: "RND public key not found" });

      const signData = {
        projectId: project._id.toString(),
        action,
        role: "RND",
      };

      const verify = crypto.createVerify("RSA-SHA256");
      verify.update(JSON.stringify(signData));
      verify.end();

      const isValid = verify.verify(
        rndUser.publicKey,
        Buffer.from(signature, "base64")
      );

      if (!isValid)
        return res.status(400).json({ msg: "Signature invalid" });

      // ✅ store decision
      project.status =
        action === "approve" ? "pending_dean" : "rejected_by_rnd";

      project.rndDecision = {
        action,
        signature,
        decidedBy: rndUser.email,
        decidedAt: new Date(),
      };

      await project.save();

      res.json({ success: true, status: project.status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

app.get(
  "/project/dean",
  auth(["DEAN"]),
  async (req, res) => {
    try {
      const projects = await Project.find({
        status: "pending_dean",
      }).sort({ createdAt: -1 });

      res.json(projects);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);


// Dean approve/reject
app.post("/project/dean-action/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, "SECRET_KEY");
    const email = decoded.email;

    const { action, signature, decisionData } = req.body;

    if (!action || !signature || !decisionData) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ msg: "Invalid action" });
    }

    // 🔑 get dean public key
    const user = await User.findOne({ email });
    if (!user || !user.publicKey) {
      return res.status(404).json({ msg: "Dean public key not found" });
    }

    // 🔐 VERIFY SIGNATURE
    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(JSON.stringify(decisionData));
    verify.end();

    const isValid = verify.verify(
      user.publicKey,
      Buffer.from(signature, "base64")
    );

    if (!isValid) {
      return res.status(401).json({ msg: "Invalid signature" });
    }

    // ✅ UPDATE STATUS
    const status =
      action === "approve" ? "approved" : "rejected_by_dean";

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        status,
        deanDecision: {
          action,
          signature,
          decidedBy: email,
          decidedAt: new Date(),
        },
      },
      { new: true }
    );

    res.json({ success: true, project });

  } catch (err) {
    console.error("DEAN ACTION ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// view summary
app.get("/project/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, "SECRET_KEY");

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔐 OPTIONAL ROLE CHECK (recommended)
    // PI → only own project
    if (
      decoded.role === "PI" &&
      project.submittedBy !== decoded.email
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // RND / DEAN → allowed to view
    res.json(project);

  } catch (err) {
    console.error("PROJECT FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Download project file with tamper check
app.get("/project/file/:id", auth(["PI", "RND", "DEAN"]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Not found" });

     // file missing check
    if (!fs.existsSync(project.attachmentPath)) {
  return res.status(200).json({
    tampered: true,
    message: "File missing or tampered",
  });
}

    // read file
    const fileBuffer = fs.readFileSync(project.attachmentPath);
    
    // generate new hash for verification
    const newHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    const tampered = newHash !== project.pdfHash;

    res.json({
      tampered,
      fileUrl: `http://localhost:5000/${project.attachmentPath}`,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error reading file" });
  }
});

app.post("/purchase/submit", async (req, res) => {
  try {
    const form = req.body;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Generate HTML directly from backend
    const html = generatePurchaseHTML(form);

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=purchase.pdf",
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});


app.use("/api/projects",projectRoutes); 



// SERVER RUN
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
