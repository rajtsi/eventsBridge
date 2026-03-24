import sequelize from "../config/db";
import { DataTypes } from "sequelize";
const Subscription = sequelize
    .define("Subscription", {
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
            allowNull: false
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true
        }           
    }, { timestamps: true });

export default Subscription;



event_type
target_url
secret
metadata(json)
timestamps