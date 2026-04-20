import { Worker } from "bullmq";
import IORedis from "ioredis";
import deliveryService from "../services/deliveryService.js";

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const worker = new Worker(
    "delivery-queue",
    async (job) => {
        console.log("Processing job", { id: job.id, name: job.name });
        const { deliveryId } = job.data;

        await deliveryService.processOneDeliveryById(deliveryId);
    },
    {
        connection,
        concurrency: 5
    }
);

worker.on("ready", () => {
    console.log("✅ Worker ready");
});

worker.on("active", (job) => {
    console.log("🔥 Job started:", job.id);
});

worker.on("completed", (job) => {
    console.log("✅ Job completed:", job.id);
});

worker.on("failed", (job, err) => {
    console.log("❌ Job failed:", job.id, err.message);
});

export default worker;
