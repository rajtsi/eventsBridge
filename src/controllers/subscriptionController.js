import logger from "../utils/logger.js";
import subscriptionService from "../services/subscriptionService.js";

const create = async (req, res) => {
    try {
        logger.info("Creating subscription", { body: req.body });

        const sub = await subscriptionService.create(req.body);

        logger.info("Subscription created", { subscriptionId: sub.id });

        res.status(201).json(sub);

    } catch (err) {
        logger.error("Subscription creation failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

const getSubscriptions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        logger.info("Fetching subscriptions", { page: Number(page), limit: Number(limit) });

        const data = await subscriptionService.getSubscriptions({
            page: Number(page),
            limit: Number(limit)
        });

        res.json({
            count: data.count,
            page: Number(page),
            limit: Number(limit),
            rows: data.rows
        });

    } catch (err) {
        logger.error("Fetch subscriptions failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

const deactivate = async (req, res) => {
    try {
        const result = await subscriptionService.deactivate(req.params.id);

        logger.info("Subscription deactivated", { id: req.params.id });

        res.json(result);

    } catch (err) {
        logger.error("Deactivate failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

export default {
    create,
    getSubscriptions,
    deactivate
};