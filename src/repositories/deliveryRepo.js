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

export default {
    create,
    getPendingDeliveries,
    update,
    getById
};
