import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const deliveryQueue = new Queue("delivery-queue", {
    connection
});

export default deliveryQueue;