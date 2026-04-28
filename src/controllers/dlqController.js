import dlqQueue from "../queues/dlqQueue.js";
import deliveryQueue from "../queues/deliveryQueue.js";
import deliveryRepo from "../repositories/deliveryRepo.js";
import { Op } from "sequelize";

/**
 * GET /dlq
 * Paginated list of DLQ jobs
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
            attempts: job.attemptsMade,
            failedReason: job.failedReason,
            status: job.finishedOn ? "completed" : "failed",
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
 * Retry job from DLQ
 */
const retryJob = async (req, res) => {
    try {
        const job = await dlqQueue.getJob(req.params.id);

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        const { deliveryId } = job.data;

        const delivery = await deliveryRepo.getById(deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: "Delivery not found" });
        }

        // prevent duplicate retry (atomic)
        const updated = await deliveryRepo.updateWhere(
            { id: deliveryId, status: { [Op.ne]: "pending" } },
            { status: "pending", attemptCount: 0 }
        );

        if (!updated) {
            return res.status(409).json({
                error: "Delivery already in progress"
            });
        }

        // enqueue again
        await deliveryQueue.add(
            "deliver",
            { deliveryId },
            {
                jobId: deliveryId,
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000
                },
                removeOnComplete: true,
                removeOnFail: false
            }
        );

        // remove from DLQ after enqueue
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