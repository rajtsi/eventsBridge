import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const IdempotencyKey = sequelize.define(
    "IdempotencyKey",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        key: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        response: {
            type: DataTypes.JSONB,
        },
    },
    {
        tableName: "IdempotencyKeys",
        timestamps: true,
        updatedAt: false,
    }
);

export default IdempotencyKey;