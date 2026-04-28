import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import traceIdMiddleware from "./middlewares/traceId.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import dlqRoutes from "./routes/dlqRoutes.js";
const app = express();

app.use(express.json());


app.use(traceIdMiddleware);

// routes
app.use("/", healthRoutes);
app.use("/events", eventRoutes);
app.use("/services", serviceRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/webhook", webhookRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/dlq", dlqRoutes);
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;