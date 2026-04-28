import logger from "../utils/logger.js";
import serviceService from "../services/serviceService.js";

const createService = async (req, res) => {
    try {
        logger.info("Creating service", { body: req.body });

        const service = await serviceService.createService(req.body);

        logger.info("Service created", { serviceId: service.id });
        res.status(201).json({
            message: "Service created",
            data: service
        });

    } catch (err) {
        logger.error("Service creation failed", { error: err.message });

        res.status(500).json({ error: err.message });
    }
};

const getServices = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        logger.info("Fetching services", { page: Number(page), limit: Number(limit) });
        const data = await serviceService.getServices({
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
        logger.error("Fetch services failed", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

export default {
    createService,
    getServices
};