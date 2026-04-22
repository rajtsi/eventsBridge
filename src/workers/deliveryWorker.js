import { Worker } from "bullmq";
import IORedis from "ioredis";
import deliveryService from "../services/deliveryService.js";
import dlqQueue from "../queues/dlqQueue.js";
import logger from "../utils/logger.js";

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const worker = new Worker(
    "delivery-queue",
    async (job) => {
        console.log("Processing job", { id: job.id, name: job.name });
        logger.info("Processing job", {
            jobId: job.id,
            jobName: job.name
        });

        const { deliveryId } = job.data;

        await deliveryService.processOneDeliveryById(deliveryId, job);
    },
    {
        connection,
        concurrency: 5
    }
);

worker.on("ready", () => {
    console.log("Worker ready");
    logger.info("Worker ready");
});

worker.on("active", (job) => {
    console.log("Job started", {
        jobId: job.id,
        attempt: job.attemptsMade + 1
    });

    logger.info("Job started", {
        jobId: job.id,
        attempt: job.attemptsMade + 1
    });
});

worker.on("completed", (job) => {
    console.log("Job completed", {
        jobId: job.id
    });

    logger.info("Job completed", {
        jobId: job.id
    });
});

worker.on("failed", async (job, err) => {
    if (job.attemptsMade >= job.opts.attempts) {
        const logData = {
            jobId: job.id,
            deliveryId: job.data.deliveryId,
            attempts: job.attemptsMade,
            error: err.message
        };

        console.log("Final failure", logData);
        logger.error("Final failure", logData);

        try {
            await dlqQueue.add("dead-delivery", {
                deliveryId: job.data.deliveryId,
                error: err.message,
                attempts: job.attemptsMade,
                failedAt: new Date()
            });
        } catch (dlqErr) {
            console.error("Failed to push to DLQ", dlqErr);
            logger.error("Failed to push to DLQ", {
                error: dlqErr.message
            });
        }
    }
});

export default worker;