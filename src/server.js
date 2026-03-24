import app from "./app.js";
import { initDB } from "./config/dbInit.js";

// models
import "./models/Event.js";
import "./models/Subscription.js";
import "./models/Service.js";
import "./models/Delivery.js";

const PORT = 3000;

async function start() {
    await initDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();