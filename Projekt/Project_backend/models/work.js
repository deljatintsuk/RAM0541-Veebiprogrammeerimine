const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('work', {
    workid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'works',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "works_pkey",
        unique: true,
        fields: [
          { name: "workid" },
        ]
      },
    ]
  });
};
