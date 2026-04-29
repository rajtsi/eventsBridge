import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const EventType = sequelize.define("EventType", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fields: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, {
    tableName: "EventTypes", // optional but safer
});

export default EventType;