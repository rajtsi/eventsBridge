import Delivery from "../models/Delivery.js";
import { Op } from "sequelize";
import logger from "../utils/logger.js";
import callWebhook from "./callWebhooks.js";

async function processDeliveries() {
    logger.info("Worker running...", { data: "rajajajajajt" });

    const deliveries = await Delivery.findAll({
        where: {
            status: "pending",
            [Op.or]: [
                { next_retry_at: null },
                { next_retry_at: { [Op.lte]: new Date() } }
            ]
        }
    });
    await callWebhook(deliveries);
}

export default processDeliveries;