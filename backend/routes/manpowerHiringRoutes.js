import express from "express";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createManpowerHiring, getMyManpowerHirings } from "./controllers/manpowerHiringController.js";

const router = express.Router();

router.post("/", auth(["PI"]), upload.single("appForm"), createManpowerHiring);
router.get("/", auth(["PI"]), getMyManpowerHirings);

export default router;
