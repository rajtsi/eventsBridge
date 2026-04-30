import models from "../models/index.js";
import { Op } from "sequelize";

function getTimeRange(window) {
    const now = new Date();

    if (window === "1h") {
        return new Date(now.getTime() - 60 * 60 * 1000);
    }
    if (window === "24h") {
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    if (window === "7d") {
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return new Date(now.getTime() - 5 * 60 * 1000);
}

async function getStats(window) {
    const from = getTimeRange(window);

    const totalEvents = await models.Event.count({
        where: { createdAt: { [Op.gte]: from } }
    });

    const totalDeliveries = await models.Delivery.count({
        where: { createdAt: { [Op.gte]: from } }
    });

    const success = await models.Delivery.count({
        where: {
            status: "success",
            createdAt: { [Op.gte]: from }
        }
    });

    const failed = await models.Delivery.count({
        where: {
            status: "failed",
            createdAt: { [Op.gte]: from }
        }
    });

    return {
        totalEvents,
        totalDeliveries,
        success,
        failed
    };
}

export default { getStats };