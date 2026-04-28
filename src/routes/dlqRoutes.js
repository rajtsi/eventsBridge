import express from "express";
import dlqController from "../controllers/dlqController.js";

const router = express.Router();

router.get("/", dlqController.getJobs);
router.post("/:id/retry", dlqController.retryJob);

export default router;