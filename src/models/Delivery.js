import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Delivery = sequelize.define("Delivery", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },

    eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "event_id"
    },

    subscriptionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "subscription_id"
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
            isIn: [["pending", "success", "failed"]]
        }
    },

    attemptCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "attempt_count"
    },

    response: {
        type: DataTypes.JSONB,
        allowNull: true
    },

    nextRetryAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "next_retry_at"
    },

    traceId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "trace_id"
    }

}, {
    timestamps: true,
    tableName: "Deliveries"
});



Delivery.associate = (models) => {
    Delivery.belongsTo(models.Event, {
        foreignKey: "event_id",
        as: "event"
    });

    Delivery.belongsTo(models.Subscription, {
        foreignKey: "subscription_id",
        as: "subscription"
    });
};

export default Delivery;