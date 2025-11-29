import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";

const Blog = sequelize.define("Blog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isMain: {
    type: DataTypes.CHAR,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  posted_by: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "blog",
  timestamps: true
});

export default Blog;
