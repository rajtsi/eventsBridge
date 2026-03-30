import Delivery from "../models/Delivery.js";
import Subscription from "../models/Subscription.js";
import Service from "../models/Service.js";
import { Op } from "sequelize";
import crypto from "crypto";

async function processDeliveries() {
    console.warn("Worker running...");

    const deliveries = await Delivery.findAll({
        where: {
            status: "pending",
            [Op.or]: [
                { next_retry_at: null },
                { next_retry_at: { [Op.lte]: new Date() } }
            ]
        }
    });

    for (const delivery of deliveries) {
        try {
            const sub = await Subscription.findByPk(delivery.subscription_id);
            if (!sub) continue;

            const service = await Service.findByPk(sub.service_id);
            if (!service) continue;

            const payload = { event: delivery.event_id };

            const signature = crypto
                .createHmac("sha256", service.secret)
                .update(JSON.stringify(payload))
                .digest("hex");

            const res = await fetch(service.base_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Signature": signature
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await delivery.update({
                    status: "success",
                    response: { ok: true }
                });
            } else {
                throw new Error("Request failed");
            }

        } catch (err) {
            const attempts = delivery.attempt_count + 1;

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
}

export default processDeliveries;