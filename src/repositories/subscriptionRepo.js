import models from "../models/index.js";

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

async function getById(id) {
    return models.Subscription.findByPk(id);
}

export default {
    create,
    getByEventType,
    getById
};