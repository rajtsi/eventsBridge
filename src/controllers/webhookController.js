import crypto from "crypto";
import logger from "../utils/logger.js";
import webhookClientRepo from "../repositories/webhookClientRepo.js";
import idempotencyRepo from "../repositories/idempotencyRepo.js";

const verify = (body, secret, signature) => {
    const expected = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(body))
        .digest("hex");

    return expected === signature;
};

const handleWebhook = (service) => async (req, res) => {
    try {
        const clientId = req.headers["x-client-id"];
        const signature = req.headers["x-signature"];
        const idemKey = req.headers["idempotency-key"];

        if (!clientId || !signature || !idemKey) {
            return res.status(400).json({ error: "missing headers" });
        }

        const client = await webhookClientRepo.get(clientId, service);

        if (!client) {
            return res.status(401).json({ error: "invalid client" });
        }

        if (!verify(req.body, client.secret, signature)) {
            return res.status(401).json({ error: "invalid signature" });
        }

        const existing = await idempotencyRepo.get(idemKey);

        if (existing) {
            if (existing.response?.error) {
                return res.status(500).json(existing.response);
            }
            return res.json(existing.response);
        }

        logger.info(`${service} webhook verified`, {
            clientId,
            idemKey,
        });

        let response;

        const amount =
            req.body.data?.amount ?? req.body.payload?.amount;

        // 🔥 Service-specific logic
        if (service === "payment") {
            if (amount > 1000) {
                response = { error: "payment failed" };
                await idempotencyRepo.create(idemKey, response);
                return res.status(500).json(response);
            }

            response = { status: "payment processed" };
        }

        else if (service === "email") {
            response = { status: "email sent" };
        }

        else if (service === "notification") {
            response = { status: "notification delivered" };
        }

        else if (service === "analytics") {
            response = { status: "event tracked" };
        }

        else {
            response = { status: "processed" };
        }

        await idempotencyRepo.create(idemKey, response);

        res.json(response);

    } catch (err) {
        logger.error("webhook error", { error: err.message });
        res.status(500).json({ error: err.message });
    }
};

export default {
    payment: handleWebhook("payment"),
    email: handleWebhook("email"),
    notification: handleWebhook("notification"),
    analytics: handleWebhook("analytics"),
};