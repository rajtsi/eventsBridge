import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payload: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
});

export default Event;



