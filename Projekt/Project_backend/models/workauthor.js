const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workauthor', {
    workid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'works',
        key: 'workid'
      }
    },
    authorid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'authors',
        key: 'authorid'
      }
    }
  }, {
    sequelize,
    tableName: 'workauthors',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "workauthors_pkey",
        unique: true,
        fields: [
          { name: "workid" },
          { name: "authorid" },
        ]
      },
    ]
  });
};
