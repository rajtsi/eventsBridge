import express from "express";
import subscriptionController from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/", subscriptionController.create);
router.get("/", subscriptionController.getSubscriptions);
router.patch("/:id/deactivate", subscriptionController.deactivate);

export default router;