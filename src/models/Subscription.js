import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Subscription = sequelize.define("Subscription", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },

    eventType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        field: "event_type"
    },

    serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "service_id"
    },

    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active"
    }

}, {
    timestamps: true,
    tableName: "Subscriptions"
});


Subscription.associate = (models) => {
    Subscription.belongsTo(models.Service, {
        foreignKey: "service_id",
        as: "service"
    });
};

export default Subscription;