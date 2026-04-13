import models from "../models/index.js";

async function getById(id) {
    return models.Service.findByPk(id);
}

async function create(data) {
    return models.Service.create(data);
}

export default {
    getById,
    create
};