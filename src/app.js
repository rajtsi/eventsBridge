import express from "express";
import apiRoutes from "./routes/api.js";

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.send("API running");
});

export default app;