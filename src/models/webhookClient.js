import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const WebhookClient = sequelize.define(
    "WebhookClient",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        clientId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        service: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "WebhookClients",
        timestamps: true,
    }
);

export default WebhookClient;