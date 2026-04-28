import sequelize from "../config/db.js";
import Event from "./Event.js";
import Service from "./Service.js";
import Subscription from "./Subscription.js";
import Delivery from "./Delivery.js";
import WebhookClient from "./webhookClient.js";
import IdempotencyKey from "./idempotencyKey.js";

const models = {
    Event,
    Service,
    Subscription,
    Delivery,
    WebhookClient,
    IdempotencyKey,
};


Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export { sequelize };
export default models;