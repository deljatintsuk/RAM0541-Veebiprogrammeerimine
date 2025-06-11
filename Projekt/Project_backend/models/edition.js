const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('edition', {
    editionid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    workid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'works',
        key: 'workid'
      }
    },
    isbn13: {
      type: DataTypes.STRING(13),
      allowNull: true,
      unique: "editions_isbn13_key"
    },
    publisher: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    publicationdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    availability: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Available"
    }
  }, {
    sequelize,
    tableName: 'editions',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "editions_isbn13_key",
        unique: true,
        fields: [
          { name: "isbn13" },
        ]
      },
      {
        name: "editions_pkey",
        unique: true,
        fields: [
          { name: "editionid" },
        ]
      },
    ]
  });
};
