
import serviceRepo from "../repositories/serviceRepo.js";
import subscriptionRepo from "../repositories/subscriptionRepo.js";
import deliveryRepo from "../repositories/deliveryRepo.js";
import crypto from "crypto";
import logger from "../utils/logger.js";
import { asyncLocalStorage } from "../utils/als.js";

async function processOneDelivery(delivery) {
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

                const payload = { event: delivery.eventId };

                const signature = crypto
                    .createHmac("sha256", service.secret)
                    .update(JSON.stringify(payload))
                    .digest("hex");

                logger.info("Calling webhook", {
                    url: service.baseUrl
                });

                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);

                const res = await fetch(service.baseUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Signature": signature,
                        "X-Trace-Id": delivery.traceId,
                        "X-Delivery-Id": delivery.id
                    },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });

                clearTimeout(timeout);

                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }

                await deliveryRepo.update(delivery, {
                    status: "success",
                    response: { ok: true }
                });

            } catch (err) {
                const attempts = (delivery.attemptCount || 0) + 1;

                logger.error("Delivery attempt failed", {
                    error: err.message
                });

                if (attempts >= 3) {
                    await deliveryRepo.update(delivery, {
                        status: "failed",
                        attemptCount: attempts,
                        response: { error: err.message }
                    });
                } else {
                    await deliveryRepo.update(delivery, {
                        attemptCount: attempts,
                        nextRetryAt: new Date(Date.now() + 60000),
                        response: { error: err.message }
                    });
                }
            }
        }
    );
}

async function processOneDeliveryById(deliveryId) {
    const delivery = await deliveryRepo.getById(deliveryId);

    if (!delivery) {
        throw new Error("Delivery not found");
    }

    return processOneDelivery(delivery);
}

export default { processOneDelivery, processOneDeliveryById };