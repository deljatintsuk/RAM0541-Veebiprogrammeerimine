const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define(
    "Role", {
    name: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: 'roles'
});

module.exports = Role;