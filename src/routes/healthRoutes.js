import express from "express";
import sequelize from "../config/db.js";
import redisConnection from "../config/redis.js";

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

router.get("/ready", async (req, res) => {
    try {
        await sequelize.authenticate();
        await redisConnection.ping();

        res.json({
            status: "ready",
            db: "up",
            redis: "up"
        });

    } catch (err) {
        res.status(500).json({
            status: "not ready",
            error: err.message
        });
    }
});

export default router;