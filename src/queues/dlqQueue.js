import { Queue } from "bullmq";
import IORedis from "ioredis";

import dotenv from "dotenv";

dotenv.config();

const connection = new IORedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null
});

const dlqQueue = new Queue("delivery-dlq", {
    connection
});

export default dlqQueue;