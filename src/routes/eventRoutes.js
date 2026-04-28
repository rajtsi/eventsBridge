import express from "express";
import eventController from "../controllers/eventController.js";

const router = express.Router();

router.post("/", eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

export default router;