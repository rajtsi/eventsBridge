import express from "express";
import sequelize from "./config/db.js";
import "./models/Event.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API running");
});


async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Database connected ");

        await sequelize.sync({ force: true });
        console.log("Database synced ");

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    } catch (error) {
        console.error("DB connection failed ", error);
    }
}

startServer();