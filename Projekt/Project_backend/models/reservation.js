const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reservation', {
    reservationid: {
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
      },
      unique: "reservations_userid_workid_status_key"
    },
    workid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'works',
        key: 'workid'
      },
      unique: "reservations_userid_workid_status_key"
    },
    reservationdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Active",
      unique: "reservations_userid_workid_status_key"
    },
    fulfilleddate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    offer_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'reservations',
    schema: 'libraryapp',
    timestamps: false,
    indexes: [
      {
        name: "reservations_pkey",
        unique: true,
        fields: [
          { name: "reservationid" },
        ]
      },
      {
        name: "reservations_userid_workid_status_key",
        unique: true,
        fields: [
          { name: "userid" },
          { name: "workid" },
          { name: "status" },
        ]
      },
    ]
  });
};
