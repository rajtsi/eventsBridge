import models from "../models/index.js";

async function get(key) {
    return models.IdempotencyKey.findOne({ where: { key } });
}

async function create(key, response) {
    return models.IdempotencyKey.create({ key, response });
}

export default {
    get,
    create,
};