import { DataTypes } from "sequelize";
import sequelize from "../../database/database.js";
import Blog from "./Blog.js";

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Blog,
      key: "id"
    },
    onDelete: "CASCADE"
  },
  commenter_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "comments",
  timestamps: true
});

Blog.hasMany(Comment, { foreignKey: "blog_id", onDelete: "CASCADE" });
Comment.belongsTo(Blog, { foreignKey: "blog_id" });

export default Comment;
