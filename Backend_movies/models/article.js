const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");


const Article = sequelize.define("Article", {
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, { tableName: 'articles' });

module.exports = Article;