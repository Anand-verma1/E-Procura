import ManpowerHiring from "../../models/ManpowerHiring.js";
import CodeCreation from "../../models/codeCreation.js";

export const createManpowerHiring = async (req, res) => {
  try {
    if (!req.body.formData) {
      return res.status(400).json({ message: "formData missing" });
    }

    const form = JSON.parse(req.body.formData);

    const project = await CodeCreation.findById(form.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
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
