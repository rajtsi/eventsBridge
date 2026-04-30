import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import traceIdMiddleware from "./middlewares/traceId.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import dlqRoutes from "./routes/dlqRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import eventTypeRoutes from "./routes/eventTypeRoutes.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.use(traceIdMiddleware);

// routes
app.use("/", healthRoutes);
app.use("/events", eventRoutes);
app.use("/services", serviceRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/webhook", webhookRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/dlq", dlqRoutes);
app.use("/stats", statsRoutes);
app.use("/event-types", eventTypeRoutes);
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;