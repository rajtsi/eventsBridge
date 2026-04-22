import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const dlqQueue = new Queue("delivery-dlq", {
    connection
});

export default dlqQueue;