import statsService from "../services/statsService.js";

const getStats = async (req, res) => {
    try {
        const { window = "1h" } = req.query;

        const data = await statsService.getStats(window);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default { getStats };