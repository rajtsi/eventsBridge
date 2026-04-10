import app from "./app.js";
import { initDB } from "./config/dbInit.js";
import models from "./models/index.js";
const PORT = 3000;

async function start() {
    await initDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();