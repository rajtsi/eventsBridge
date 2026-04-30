import deliveryService from "../services/deliveryService.js";
import logger from "../utils/logger.js";

const getDeliveries = async (req, res) => {
    try {
        let { page = 1, limit = 10, status, eventId, from, to } = req.query;

        const now = new Date();

        if (!to) {
            to = now;
        } else {
            to = new Date(to);
        }

        if (!from) {
            from = new Date(now.getTime() - 60 * 60 * 1000); // default 1h
        } else {
            from = new Date(from);
        }

        const data = await deliveryService.getDeliveries({
            page: Number(page),
            limit: Number(limit),
            status,
            eventId,
            from,
            to
        });

        logger.info("Fetched deliveries", {
            page: Number(page),
            limit: Number(limit),
            status,
            eventId,
            from,
            to,
            count: data.count
        });

        res.json({
            count: data.count,
            page: Number(page),
            limit: Number(limit),
            from,
            to,
            rows: data.rows
        });

    } catch (err) {
        logger.error("Fetch deliveries failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

const getDeliveryById = async (req, res) => {
    try {
        const data = await deliveryService.getById(req.params.id);
        logger.info("Fetched delivery", { id: req.params.id, data });
        res.json(data);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

export default { getDeliveries, getDeliveryById };