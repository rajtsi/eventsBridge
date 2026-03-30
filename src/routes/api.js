import express from "express";
import Event from "../models/Event.js";
import Subscription from "../models/Subscription.js";
import Service from "../models/Service.js";
import Delivery from "../models/Delivery.js";

const router = express.Router();


// ✅ Create Service
router.post("/service", async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ Create Subscription
router.post("/subscription", async (req, res) => {
    try {
        const sub = await Subscription.create(req.body);
        res.json(sub);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔥 Create Event (CORE)
router.post("/event", async (req, res) => {
    try {
        const event = await Event.create(req.body);

        const subs = await Subscription.findAll({
            where: { event_type: event.type }
        });

        for (const sub of subs) {
            await Delivery.create({
                event_id: event.id,
                subscription_id: sub.id,
                status: "pending"
            });
        }

        res.json({ event, deliveriesCreated: subs.length });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🧪 Dummy webhook 1
router.post("/webhook/test1", (req, res) => {
    console.log("Webhook 1 hit:", req.body);
    res.json({ success: true });
});


// 🧪 Dummy webhook 2 (random fail)
router.post("/webhook/test2", (req, res) => {
    console.log("Webhook 2 hit:", req.body);

    if (Math.random() < 0.5) {
        return res.status(500).json({ error: "Random failure" });
    }

    res.json({ success: true });
});

export default router;