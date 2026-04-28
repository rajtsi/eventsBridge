import models from "../models/index.js";
import { Op } from "sequelize";
async function create(data) {
    return models.Event.create(data);
}

async function getById(id) {
    return models.Event.findByPk(id);
}

const getEvents = async ({ from, to, type, page, limit }) => {

    const where = {};
    if (from || to) {
        where.createdAt = {};
        if (from) where.createdAt[Op.gte] = new Date(from);
        if (to) where.createdAt[Op.lte] = new Date(to);
    }
    if (type) {
        where.type = type;
    }

    const offset = (page - 1) * limit;

    return models.Event.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]]
    });
};
async function getByIdWithDeliveries(id) {
    return models.Event.findByPk(id, {
        include: [
            {
                model: models.Delivery,
                as: "deliveries"
            }
        ]
    });
}
export default {
    create,
    getEvents,
    getById,
    getByIdWithDeliveries
};