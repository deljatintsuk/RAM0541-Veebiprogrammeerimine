const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('role', {
    roleid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rolename: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "roles_rolename_key"
    }
  }, {
    sequelize,
    tableName: 'roles',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "roles_pkey",
        unique: true,
        fields: [
          { name: "roleid" },
        ]
      },
      {
        name: "roles_rolename_key",
        unique: true,
        fields: [
          { name: "rolename" },
        ]
      },
    ]
  });
};
