import sequelize from "./db.js";

export async function initDB(retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await sequelize.authenticate();
            console.log("Database connected");
            return;
        } catch (err) {
            console.log(`DB not ready, retrying (${i + 1})...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw new Error("DB connection failed");
}