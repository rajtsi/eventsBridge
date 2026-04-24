import app from "./app.js";
import { initDB } from "./config/dbInit.js";
const PORT = 3000;

async function start() {
    await initDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();