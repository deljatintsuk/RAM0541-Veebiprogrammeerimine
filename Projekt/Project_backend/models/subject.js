const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subject', {
    subjectid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subjectname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "subjects_subjectname_key"
    }
  }, {
    sequelize,
    tableName: 'subjects',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "subjects_pkey",
        unique: true,
        fields: [
          { name: "subjectid" },
        ]
      },
      {
        name: "subjects_subjectname_key",
        unique: true,
        fields: [
          { name: "subjectname" },
        ]
      },
    ]
  });
};
