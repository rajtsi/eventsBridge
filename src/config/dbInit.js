import sequelize from "./db.js";

export async function initDB() {
    try {
        await sequelize.authenticate();
        console.log("Database connected ");

        await sequelize.sync({ alter: true });
        console.log("Database synced ");
    } catch (error) {
        console.error("DB init failed ", error);
        process.exit(1);
    }
}