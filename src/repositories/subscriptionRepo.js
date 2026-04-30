import models from "../models/index.js";

async function getById(id) {
    return models.Subscription.findByPk(id);
}

async function getAll({ eventType, serviceId }) {
    const where = {
        isActive: true
    };

    if (eventType) where.eventType = eventType;
    if (serviceId) where.serviceId = serviceId;

    return models.Subscription.findAll({
        where,
        include: [
            {
                model: models.Service,
                as: "service",
                attributes: ["id", "name", "baseUrl"]
            }
        ],
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