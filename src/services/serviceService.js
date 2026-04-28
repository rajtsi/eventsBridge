import serviceRepo from "../repositories/serviceRepo.js";

const createService = async (data) => {

    if (!data.name || !data.baseUrl || !data.secret) {
        throw new Error("name, baseUrl and secret are required");
    }

    const existing = await serviceRepo.getByName(data.name);

    if (existing) {
        throw new Error("Service with this name already exists");
    }

    return serviceRepo.create(data);
};

const getServices = async () => {
    return serviceRepo.getAll();
};


export default {
    createService,
    getServices
};