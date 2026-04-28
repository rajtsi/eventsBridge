import eventRepo from "../repositories/eventRepo.js";
import subscriptionRepo from "../repositories/subscriptionRepo.js";
import deliveryRepo from "../repositories/deliveryRepo.js";
import deliveryQueue from "../queues/deliveryQueue.js";
import logger from "../utils/logger.js";

const createEvent = async (data, traceId) => {


    const event = await eventRepo.create(data);
    logger.info("Event created", { eventId: event.id });


    const subs = await subscriptionRepo.getByEventType(event.type);
    logger.info("Fetched subscriptions", { count: subs.length });

    for (const sub of subs) {

        const delivery = await deliveryRepo.create({
            eventId: event.id,
            subscriptionId: sub.id,
            status: "pending",
            traceId
        });


        await deliveryQueue.add("deliver", {
            deliveryId: delivery.id
        }, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000
            },
            removeOnComplete: true
        });
    }

    logger.info("Deliveries created", { count: subs.length });

    return {
        event,
        deliveriesCreated: subs.length
    };
};
const getEvents = async (filters) => {
    return eventRepo.getEvents(filters);
};

export default {
    createEvent,
    getEvents
};