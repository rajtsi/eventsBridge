
import serviceRepo from "../repositories/serviceRepo.js";
import subscriptionRepo from "../repositories/subscriptionRepo.js";
import deliveryRepo from "../repositories/deliveryRepo.js";
import crypto from "crypto";
import logger from "../utils/logger.js";
import { asyncLocalStorage } from "../utils/als.js";
import eventRepo from "../repositories/eventRepo.js";
import dotenv from "dotenv";
dotenv.config();
async function processOneDelivery(delivery, job) {
    await asyncLocalStorage.run(
        {
            traceId: delivery.traceId,
            deliveryId: delivery.id
        },
        async () => {
            try {
                const sub = await subscriptionRepo.getById(delivery.subscriptionId);

                if (!sub) {
                    throw new Error("Subscription not found");
                }

                const service = await serviceRepo.getById(sub.serviceId);

                if (!service) {
                    throw new Error("Service not found");
                }

                const event = await eventRepo.getById(delivery.eventId);
                if (!event) {
                    throw new Error("Event not found");
                }

                const payload = {
                    id: event.id,
                    type: event.type,
                    data: event.payload
                };

                const signature = crypto
                    .createHmac("sha256", service.secret)
                    .update(JSON.stringify(payload))
                    .digest("hex");

                logger.info("Calling webhook", {
                    deliveryId: delivery.id,
                    eventId: event.id,
                    attempt: job.attemptsMade + 1,
                    url: service.baseUrl
                });

                logger.info("Using clientId", {
                    clientId: process.env.CLIENT_ID
                });


                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);

                let res;



                try {
                    res = await fetch(service.baseUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Signature": signature,
                            "X-Trace-Id": delivery.traceId,
                            "X-Delivery-Id": delivery.id,
                            "Idempotency-Key": `${delivery.eventId}:${service.name}`,
                            "X-Client-Id": process.env.CLIENT_ID
                        },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });
                    const text = await res.text();

                    logger.info("Webhook response", {
                        deliveryId: delivery.id,
                        status: res.status,
                        body: text
                    });

                    if (!res.ok) {
                        throw new Error(`Request failed with status ${res.status}`);
                    }

                } finally {
                    clearTimeout(timeout);
                }

                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                await deliveryRepo.update(delivery, {
                    status: "success",
                    attemptCount: job.attemptsMade + 1,
                    response: { ok: true }
                });

                logger.info("Delivery succeeded", {
                    deliveryId: delivery.id,
                    attempt: job.attemptsMade + 1,
                    maxAttempts: job.opts.attempts
                });

            } catch (err) {
                logger.error("Delivery attempt failed", {
                    deliveryId: delivery.id,
                    jobId: job.id,
                    attempt: job.attemptsMade + 1,
                    maxAttempts: job.opts.attempts,
                    error: err.message
                });

                await deliveryRepo.update(delivery, {
                    status: "failed",
                    attemptCount: job.attemptsMade + 1,
                    response: { error: err.message }
                });

                throw err;
            }
        }
    );
}

async function processOneDeliveryById(deliveryId, job) {
    const delivery = await deliveryRepo.getById(deliveryId);

    if (!delivery) {
        throw new Error("Delivery not found");
    }

    return processOneDelivery(delivery, job);
}
const getDeliveries = (params) => {
    return deliveryRepo.getAll(params);
};

const getById = (id) => {
    return deliveryRepo.getById(id);
};

export default { processOneDelivery, processOneDeliveryById, getDeliveries, getById };