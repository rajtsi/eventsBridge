import logger from "../utils/logger.js";
import eventService from "../services/eventService.js";

const createEvent = async (req, res) => {
    try {
        logger.info("Creating event", { body: req.body });

        const result = await eventService.createEvent(
            req.body,
            req.traceId
        );

        res.json(result);

    } catch (err) {
        logger.error("Event creation failed", {
            error: err.message,
            body: req.body
        });

        res.status(500).json({ error: err.message });
    }
};



const getEvents = async (req, res) => {
    try {
        let { from, to, type, page = 1, limit = 10 } = req.query;
        const now = new Date();
        if (!to) {
            to = now;
        } else {
            to = new Date(to);
        }

        if (!from) {
            from = new Date(now.getTime() - 5 * 60 * 1000); // last 5 min
        } else {
            from = new Date(from);
        }

        const result = await eventService.getEvents({
            from,
            to,
            type,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        res.json({
            total: result.count,
            page,
            limit,
            from,
            to,
            events: result.rows
        });

    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const data = await eventService.getEventById(req.params.id);
        logger.info("Fetched event", { id: req.params.id, data });
        res.json(data);
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

export default {
    createEvent,
    getEvents,
    getEventById
};