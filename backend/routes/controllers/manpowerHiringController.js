import ManpowerHiring from "../../models/ManpowerHiring.js";
import CodeCreation from "../../models/codeCreation.js";
import User from "../../models/user.js";
import crypto from "crypto";

export const createManpowerHiring = async (req, res) => {
  try {
    if (!req.body.formData) {
      return res.status(400).json({ message: "formData missing" });
    }
    if (!req.body.signature) {
      return res.status(400).json({ message: "signature missing" });
    }

    const form = JSON.parse(req.body.formData);

    const project = await CodeCreation.findById(form.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify digital signature using PI's stored public key
    const user = await User.findOne({ email: req.user.email });
    if (!user || !user.publicKey) {
      return res.status(400).json({ message: "Public key not found. Please generate your key pair first." });
    }

    const verify = crypto.createVerify("SHA256");
    verify.update(JSON.stringify(form));
    verify.end();

    const isValid = verify.verify(
      {
        key: user.publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32,
      },
      Buffer.from(req.body.signature, "base64")
    );

    if (!isValid) {
      return res.status(401).json({ message: "Signature verification failed. Make sure you are using the correct private key." });
    }

    const newHiring = await ManpowerHiring.create({
      projectId:           form.projectId,
      projectCode:         form.projectCode,
      projectTitle:        form.projectTitle,
      reqDate:             form.reqDate,
      agency:              form.agency,
      piName:              form.piName,
      piDesig:             form.piDesig,
      piAddr:              form.piAddr,
      piEmail:             form.piEmail,
      piWeb:               form.piWeb,
      posType:             form.posType,
      posLabel:            form.posLabel,
      numPosts:            Number(form.numPosts) || 0,
      ageLimit:            form.ageLimit,
      salMin:              form.salMin,
      salMax:              form.salMax,
      salNote:             form.salNote,
      duration:            form.duration,
      deadline:            form.deadline,
      notifDate:           form.notifDate,
      emailSub:            form.emailSub,
      essentials:          form.essentials || [],
      desirables:          form.desirables || [],
      committee:           (form.committee || []).filter(Boolean),
      customTerms:         (form.customTerms || []).filter(Boolean),
      appFormPath:         req.file?.path || "",
      appFormOriginalName: req.file?.originalname || "",
      signature:           req.body.signature,
      submittedBy:         req.user.email,
    });

    res.status(201).json({ message: "Manpower hiring request submitted", data: newHiring });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyManpowerHirings = async (req, res) => {
  try {
    const hirings = await ManpowerHiring.find({ submittedBy: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json(hirings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
