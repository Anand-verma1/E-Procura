import CodeCreation from "../../models/codeCreation.js";
import crypto from "crypto";
import User from "../../models/user.js"

// Generate Empld - PI List for rnd form
export const getPIList = async(req,res)=>{
    const piList = await User.find({ role: "PI" }).select("fullName employeeId");
    res.json(piList);
};

// Generate Poject code by RND
export const generateProjectCode = async (req, res) => {
  try {
    const { department } = req.body;
    
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
};

// PROJECT CODE FORM CREATED BY RND  
export const createProject = async (req, res) => {
  try {

    const {
      projectCode,
      availableFunds,
      transactionId,
      piEmpId,
      piName,
      payload,
      signature
    } = req.body;

    // Validate PI exists
const piUser = await User.findOne({
  employeeId: piEmpId,
  role: "PI"
});

if (!piUser) {
  return res.status(400).json({
    message: "Invalid PI selected"
  });
}
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
if (existingProject.piEmpId) {
  return res.status(400).json({
    message: "Project already assigned to a PI"
  });
}

// update fields
existingProject.availableFunds = availableFunds;
existingProject.transactionId = transactionId;
existingProject.piEmpId = piUser.employeeId;
existingProject.piName = piUser.name;
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
};

// PI - Get Projects

export const getProjects = async (req, res) => {
  try {
    console.log("Route hit");

    const employeeId = req.user.employeeId; // coming from JWT

    const projects = await CodeCreation.find({
      piEmpId: employeeId  // Must match DB field
    }).select("projectCode availableFunds transactionId piName");


    res.json(projects);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}