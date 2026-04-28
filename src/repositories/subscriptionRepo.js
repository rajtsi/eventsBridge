import models from "../models/index.js";

async function getById(id) {
    return models.Subscription.findByPk(id);
}

async function getAll({ page, limit, eventType, serviceId }) {
    const where = {};

    if (eventType) where.eventType = eventType;
    if (serviceId) where.serviceId = serviceId;

    const offset = (page - 1) * limit;

    return models.Subscription.findAndCountAll({
        where,
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