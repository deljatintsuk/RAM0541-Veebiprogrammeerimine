const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('auditlog', {
    logid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    logtimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    actiontype: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    logdetails: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'auditlog',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "auditlog_pkey",
        unique: true,
        fields: [
          { name: "logid" },
        ]
      },
    ]
  });
};
