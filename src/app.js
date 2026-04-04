import express from "express";
import apiRoutes from "./routes/api.js";
import traceIdMiddleWare from "./middleware/traceId.js";
const app = express();

app.use(express.json());
app.use(traceIdMiddleWare);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    //console.log(req);
    res.send("API running");
});

export default app;