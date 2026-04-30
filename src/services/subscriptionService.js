import subscriptionRepo from "../repositories/subscriptionRepo.js";
import serviceRepo from "../repositories/serviceRepo.js";

const create = async (data) => {

    const { eventType, serviceId } = data;

    if (!eventType || !serviceId) {
        throw new Error("eventType and serviceId are required");
    }

    // validate service exists
    const service = await serviceRepo.getById(serviceId);
    if (!service) {
        throw new Error("Service not found");
    }
    const existing = await subscriptionRepo.findByServiceAndEvent(
        data.serviceId,
        data.eventType
    );

    if (existing) {
        throw new Error("Subscription already exists");
    }

    return subscriptionRepo.create(data);
};

const getSubscriptions = async ({ eventType, serviceId }) => {
    return subscriptionRepo.getAll({ eventType, serviceId });
};

const deactivate = async (id) => {
    const sub = await subscriptionRepo.getById(id);

    if (!sub) {
        throw new Error("Subscription not found");
    }

    if (!sub.isActive) {
        throw new Error("Already deactivated");
    }

    sub.isActive = false;
    await sub.save();

    return sub;
};

export default {
    create,
    getSubscriptions,
    deactivate
};