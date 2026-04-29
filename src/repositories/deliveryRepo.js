import models from "../models/index.js";
import { Op } from "sequelize";

async function create(data) {
    return models.Delivery.create(data);
}

async function getPendingDeliveries() {
    return models.Delivery.findAll({
        where: {
            status: "pending",
            [Op.or]: [
                { nextRetryAt: null },
                { nextRetryAt: { [Op.lte]: new Date() } }
            ]
        }
    });
}
async function getById(id) {
    return models.Delivery.findByPk(id);
}

async function getAll({ page, limit, status, eventId }) {
    const where = {};

    if (status) where.status = status;
    if (eventId) where.eventId = eventId;

    const offset = (page - 1) * limit;

    return models.Delivery.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });
}


//  update using INSTANCE
async function updateInstance(delivery, data) {
    return delivery.update(data);
}

// update using ID (THIS WAS MISSING)
async function updateById(id, data) {
    return models.Delivery.update(data, {
        where: { id }
    });
}

export default {
    create,
    getPendingDeliveries,
    updateInstance,
    updateById,
    getById,
    getAll
};
