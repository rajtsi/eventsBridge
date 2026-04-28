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

async function update(delivery, data) {
    return delivery.update(data);
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

export default {
    create,
    getPendingDeliveries,
    update,
    getById,
    getAll
};
