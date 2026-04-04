import Subscription from "../models/Subscription.js";
import Service from "../models/Service.js";
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
                    const sub = await Subscription.findByPk(delivery.subscription_id);
                    if (!sub) {
                        logger.warn("Subscription not found", { deliveryId: delivery.id });
                        return;
                    }

                    const service = await Service.findByPk(sub.service_id);
                    if (!service) {
                        logger.warn("Service not found", { deliveryId: delivery.id });
                        return;
                    }

                    const payload = { event: delivery.event_id };

                    const signature = crypto
                        .createHmac("sha256", service.secret)
                        .update(JSON.stringify(payload))
                        .digest("hex");

                    logger.info("Calling webhook", {
                        url: service.base_url
                    });

                    const res = await fetch(service.base_url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Signature": signature,
                            "X-Trace-Id": delivery.traceId,
                            "X-Delivery-Id": delivery.id
                        },
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        logger.info("Delivery successful");

                        await delivery.update({
                            status: "success",
                            response: { ok: true }
                        });
                    } else {
                        throw new Error("Request failed");
                    }

                } catch (err) {

                    const attempts = delivery.attempt_count + 1;

                    logger.error("Delivery attempt failed", {
                        error: err.message
                    });

                    if (attempts >= 3) {
                        await delivery.update({
                            status: "failed",
                            attempt_count: attempts,
                            response: { error: err.message }
                        });
                    } else {
                        await delivery.update({
                            attempt_count: attempts,
                            next_retry_at: new Date(Date.now() + 60000),
                            response: { error: err.message }
                        });
                    }
                }

            }
        );
    }
}

export default callWebhooks;