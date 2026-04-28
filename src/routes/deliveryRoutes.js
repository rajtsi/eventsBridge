import express from "express";
import deliveryController from "../controllers/deliveryController.js";

const router = express.Router();

router.get("/", deliveryController.getDeliveries);
router.get("/:id", deliveryController.getDeliveryById);

export default router;