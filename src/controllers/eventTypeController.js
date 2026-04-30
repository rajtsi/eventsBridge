import eventTypeRepo from "../repositories/eventTypeRepo.js";

const getAll = async (req, res) => {
    const data = await eventTypeRepo.getAll();
    res.json(data);
};

const create = async (req, res) => {
    const data = await eventTypeRepo.create(req.body);
    res.json(data);
};

export default { getAll, create };