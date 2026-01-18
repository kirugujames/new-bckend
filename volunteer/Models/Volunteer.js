import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";

const Volunteer = sequelize.define(
    "Volunteer",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        volunteerType: {
            type: DataTypes.ENUM("general", "event"),
            defaultValue: "general",
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        areasOfInterest: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        consent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM("pending", "approved", "rejected"),
            defaultValue: "pending",
        },
    },
    {
        tableName: "volunteers",
        timestamps: true,
    }
);

export default Volunteer;
