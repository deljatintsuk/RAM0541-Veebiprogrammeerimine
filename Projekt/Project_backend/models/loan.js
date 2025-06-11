const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loan', {
    loanid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userid'
      }
    },
    editionid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'editions',
        key: 'editionid'
      }
    },
    loandate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    duedate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    returndate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'loans',
    schema: 'libraryapp',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "loans_pkey",
        unique: true,
        fields: [
          { name: "loanid" },
        ]
      },
    ]
  });
};
