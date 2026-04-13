import deliveryRepo from "../repositories/deliveryRepo.js";
import callWebhook from "./callWebhooks.js";
import logger from "../utils/logger.js";

async function processDeliveries() {
    logger.info("Worker running...");
    const deliveries = await deliveryRepo.getPendingDeliveries();

    await callWebhook(deliveries);
}

export default processDeliveries;