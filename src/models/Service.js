import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Service = sequelize.define("Service", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },

    baseUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "base_url"
    },

    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },

    config: {
        type: DataTypes.JSONB,
        allowNull: true
    }

}, {
    timestamps: true,
    tableName: "Services"
});



Service.associate = (models) => {
    Service.hasMany(models.Subscription, {
        foreignKey: "service_id",
        as: "subscriptions"
    });
};

export default Service;