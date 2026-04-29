import dlqQueue from "../queues/dlqQueue.js";
import deliveryQueue from "../queues/deliveryQueue.js";
import deliveryRepo from "../repositories/deliveryRepo.js";
import logger from "../utils/logger.js";
/**
 * GET /dlq
 */
const getJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const start = (page - 1) * limit;
        const end = start + Number(limit) - 1;

        const jobs = await dlqQueue.getJobs(
            ["waiting", "failed", "delayed"],
            start,
            end,
            false
        );

        const rows = jobs.map((job) => ({
            id: job.id,
            deliveryId: job.data?.deliveryId,
            attempts: job.data?.attempts,
            error: job.data?.error,
            failedAt: job.data?.failedAt,
            createdAt: job.timestamp
        }));

        const counts = await dlqQueue.getJobCounts(
            "waiting",
            "failed",
            "delayed"
        );

        const total =
            counts.waiting + counts.failed + counts.delayed;

        res.json({
            count: total,
            page: Number(page),
            limit: Number(limit),
            rows
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * POST /dlq/:id/retry
 */
const retryJob = async (req, res) => {
    try {
        const job = await dlqQueue.getJob(req.params.id);

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        logger.info("DLQ Job data:", job.data);
        const { deliveryId } = job.data;
        logger.info("Extracted deliveryId:", deliveryId);

        const delivery = await deliveryRepo.getById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: "Delivery not found" });
        }

        // ✅ reset delivery state
        await deliveryRepo.updateById(deliveryId, {
            status: "pending",
            attemptCount: 0
        });

        // ✅ DO NOT SET jobId
        await deliveryQueue.add(
            "deliver",
            { deliveryId },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000
                },
                removeOnComplete: true,
                removeOnFail: false
            }
        );

        // ✅ remove DLQ job AFTER enqueue
        await job.remove();

        res.json({ message: "Retry successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default {
    getJobs,
    retryJob
};