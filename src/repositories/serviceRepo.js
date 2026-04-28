import models from "../models/index.js";

async function getById(id) {
    return models.Service.findByPk(id);
}

async function getAll({ page, limit }) {
    const offset = (page - 1) * limit;

    return models.Service.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });
}

async function create(data) {
    return models.Service.create(data);
}
async function getByName(name) {
    return models.Service.findOne({ where: { name } });
}

export default {
    getById,
    getAll,
    create,
    getByName
};