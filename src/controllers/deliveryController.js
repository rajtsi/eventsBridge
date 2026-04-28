import deliveryService from "../services/deliveryService.js";
import logger from "../utils/logger.js";
const getDeliveries = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, eventId } = req.query;

        const data = await deliveryService.getDeliveries({
            page: Number(page),
            limit: Number(limit),
            status,
            eventId
        });
        logger.info("Fetched deliveries", {
            page: Number(page),
            limit: Number(limit),
            status,
            eventId,
            count: data.count
        });
        res.json({
            count: data.count,
            page: Number(page),
            limit: Number(limit),
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