import models from "../models/index.js";

async function get(clientId, service) {
    return models.WebhookClient.findOne({
        where: {
            clientId,
            service,
            isActive: true,
        },
    });
}

async function create(data) {
    return models.WebhookClient.create(data);
}

export default {
    get,
    create,
};