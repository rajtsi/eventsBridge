import express from "express";
import Event from "../models/Event.js";
import Subscription from "../models/Subscription.js";
import Service from "../models/Service.js";
import Delivery from "../models/Delivery.js";
import logger from "../utils/logger.js";
import { trace } from "bullmq";

const router = express.Router();


//  Create Service
router.post("/service", async (req, res) => {
    try {
        logger.info("Creating service", { body: req.body });
        const service = await Service.create(req.body);
        logger.info("Service created", { serviceId: service.id });
        res.json(service);

    } catch (err) {
        logger.error("Service creation failed", { error: err.message });

        res.status(500).json({ error: err.message });
    }
});


// Create Subscription
router.post("/subscription", async (req, res) => {
    try {
        logger.info("Creating subscription", { body: req.body });
        const sub = await Subscription.create(req.body);

        logger.info("Subscription created", { subscriptionId: sub.id });

        res.json(sub);

    } catch (err) {
        logger.error("Subscription creation failed", { error: err.message });

        res.status(500).json({ error: err.message });
    }
});


//  Create Event (CORE)
router.post("/event", async (req, res) => {
    try {
        logger.info("Creating event", { body: req.body });

        const event = await Event.create({
            ...req.body
        });

        logger.info("Event created", { eventId: event.id });

        const subs = await Subscription.findAll({
            where: { event_type: event.type }
        });

        logger.info("Fetched subscriptions", { count: subs.length });

        for (const sub of subs) {
            await Delivery.create({
                event_id: event.id,
                subscription_id: sub.id,
                status: "pending",
                traceId: req.traceId
            });
        }

        logger.info("Deliveries created", { count: subs.length });

        res.json({ event, deliveriesCreated: subs.length });

    } catch (err) {
        logger.error("Event creation failed", {
            error: err.message,
            body: req.body
        });

        res.status(500).json({ error: err.message });
    }
});


//  Dummy webhook 1
router.post("/webhook/test1", (req, res) => {
    logger.info("Webhook 1 hit", { body: req.body });
    res.json({ success: true });
});


// Dummy webhook 2 (random fail)
router.post("/webhook/test2", (req, res) => {
    logger.info("Webhook 2 hit", { body: req.body });

    if (Math.random() < 0.5) {
        logger.error("Webhook 2 random failure");

        return res.status(500).json({ error: "Random failure" });
    }

    logger.info("Webhook 2 success");

    res.json({ success: true });
});

export default router;