import express from "express";
import webhookController from "../controllers/webhookController.js";

const router = express.Router();

router.post("/payment", webhookController.payment);
router.post("/email", webhookController.email);
router.post("/notification", webhookController.notification);
router.post("/analytics", webhookController.analytics);

export default router;