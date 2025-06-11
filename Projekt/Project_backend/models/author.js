const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('author', {
    authorid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "authors_name_key"
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'authors',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "authors_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "authors_pkey",
        unique: true,
        fields: [
          { name: "authorid" },
        ]
      },
    ]
  });
};
