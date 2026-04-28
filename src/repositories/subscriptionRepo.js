import models from "../models/index.js";

async function getById(id) {
    return models.Subscription.findByPk(id);
}

async function getAll({ page, limit }) {
    const offset = (page - 1) * limit;

    return models.Subscription.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });
}

async function create(data) {
    return models.Subscription.create(data);
}

async function getByEventType(eventType) {
    return models.Subscription.findAll({
        where: {
            eventType,
            isActive: true
        }
    });
}
async function findByServiceAndEvent(serviceId, eventType) {
    return models.Subscription.findOne({
        where: { serviceId, eventType }
    });
}

export default {
    getById,
    getAll,
    create,
    getByEventType,
    findByServiceAndEvent
};