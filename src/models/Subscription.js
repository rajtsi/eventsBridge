import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Subscription = sequelize.define("Subscription", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    event_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    target_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ["event_type"]
        }
    ]
});

export default Subscription;