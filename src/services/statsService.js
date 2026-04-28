import statsRepo from "../repositories/statsRepo.js";

const getStats = async (window) => {
    return statsRepo.getStats(window);
};

export default { getStats };