const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('worksubject', {
    workid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'works',
        key: 'workid'
      }
    },
    subjectid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subjects',
        key: 'subjectid'
      }
    }
  }, {
    sequelize,
    tableName: 'worksubjects',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "worksubjects_pkey",
        unique: true,
        fields: [
          { name: "workid" },
          { name: "subjectid" },
        ]
      },
    ]
  });
};
