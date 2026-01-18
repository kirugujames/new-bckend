import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";

const PartyPosition = sequelize.define(
    "PartyPosition",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        membership_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("Pending", "Approved", "Rejected", "Under Review"),
            defaultValue: "Pending",
            allowNull: false,
        },
    },
    {
        tableName: "party_positions",
        timestamps: true,
    }
);

export default PartyPosition;
