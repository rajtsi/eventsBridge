import models from "../models/index.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";
import callWebhook from "./callWebhooks.js";

async function processDeliveries() {
    logger.info("Worker running...", { data: "rajajajajajt" });

    const deliveries = await models.Delivery.findAll({
        where: {
            status: "pending",
            [Op.or]: [
                { nextRetryAt: null },
                { nextRetryAt: { [Op.lte]: new Date() } }
            ]
        }
    });
    await callWebhook(deliveries);
}

export default processDeliveries;