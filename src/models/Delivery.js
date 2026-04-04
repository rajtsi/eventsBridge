import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Delivery = sequelize.define("Delivery", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },

    event_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    subscription_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
            isIn: [["pending", "success", "failed"]]
        }
    },

    attempt_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    response: {
        type: DataTypes.JSONB,
        allowNull: true
    },

    next_retry_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    traceId: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    timestamps: true,
    indexes: [
        {
            fields: ["status"]
        },
        {
            fields: ["next_retry_at"]
        }
    ]
});

export default Delivery;