import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";

const MemberRegistration = sequelize.define(
  "memberRegistration",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
      unique: true,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    doc_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    idNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    county: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    constituency: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    area_of_interest: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ethnicity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPWD: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ncpwdNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pollingStation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    streetVillage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    membershipStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialInterest: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    membershipNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    localLeader: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    politicalDeclaration: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    termsConsent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    membershipType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    member_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("active", "withdrawn"),
      defaultValue: "active",
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "memberRegistration",
    timestamps: false,
  }
);

export default MemberRegistration;
