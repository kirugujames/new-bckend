import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import MemberRegistration from "../../member-registration/models/memberRegistration.js";
import Events from "./Event.js";

const Event_Booking = sequelize.define(
  "Event_Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
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
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Events,
        key: "id", 
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "event_booking",
    timestamps: true,
  }
);

Events.hasMany(Event_Booking, { foreignKey: "event_id", onDelete: "CASCADE" });
Event_Booking.belongsTo(Events, { foreignKey: "event_id" });

export default Event_Booking;
