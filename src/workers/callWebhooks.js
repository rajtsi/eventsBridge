import models from "../models/index.js";
import crypto from "crypto";
import logger from "../utils/logger.js";
import { asyncLocalStorage } from "../utils/als.js";

async function callWebhooks(deliveries) {

    for (const delivery of deliveries) {

        await asyncLocalStorage.run(
            {
                traceId: delivery.traceId,
                deliveryId: delivery.id
            },
            async () => {

                try {
                    const sub = await models.Subscription.findByPk(delivery.subscriptionId);

                    if (!sub) {
                        throw new Error("Subscription not found");
                    }

                    const service = await models.Service.findByPk(sub.serviceId);

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

                    const res = await fetch(service.baseUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Signature": signature,
                            "X-Trace-Id": delivery.traceId,
                            "X-Delivery-Id": delivery.id
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!res.ok) {
                        throw new Error(`Request failed with status ${res.status}`);
                    }

                    await delivery.update({
                        status: "success",
                        response: { ok: true }
                    });

                } catch (err) {
                    const attempts = (delivery.attemptCount || 0) + 1;

                    logger.error("Delivery attempt failed", {
                        error: err.message
                    });

                    if (attempts >= 3) {
                        await delivery.update({
                            status: "failed",
                            attemptCount: attempts,
                            response: { error: err.message }
                        });
                    } else {
                        await delivery.update({
                            attemptCount: attempts,
                            nextRetryAt: new Date(Date.now() + 60000),
                            response: { error: err.message }
                        });
                    }
                }

            }
        );
    }
}

export default callWebhooks;