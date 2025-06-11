const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define("Comment", {
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, { tableName: 'comments' });

module.exports = Comment;