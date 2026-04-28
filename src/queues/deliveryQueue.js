import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const deliveryQueue = new Queue("delivery-queue", {
    connection: redisConnection
});

export default deliveryQueue;