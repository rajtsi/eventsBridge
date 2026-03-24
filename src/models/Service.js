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
    base_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
            notEmpty: true
        }
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
    timestamps: true
});



Service.associate = (models) => {
    Service.hasMany(models.Subscription, {
        foreignKey: "service_id"
    });
};

export default Service;