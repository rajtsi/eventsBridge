import models from "../models/index.js";

const getAll = () => models.EventType.findAll();

const getByName = (name) =>
    models.EventType.findOne({ where: { name } });

const create = (data) =>
    models.EventType.create(data);

export default { getAll, getByName, create };