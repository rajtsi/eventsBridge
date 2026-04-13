import models from "../models/index.js";

async function create(data) {
    return models.Event.create(data);
}

export default {
    create
};