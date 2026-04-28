import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const dlqQueue = new Queue("delivery-dlq", {
    connection: redisConnection
});

export default dlqQueue;