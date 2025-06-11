const config = require("../config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  config.db.DATABASE,
  config.db.USER,
  config.db.PASSWORD,
  {
    host: config.db.HOST,
    port: config.db.PORT,
    dialect: config.db.DIALECT,
    schema: config.db.SCHEMA,
    pool: config.db.pool,
    logging: false
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Mudelite importimine
db.role = require("./role.js")(sequelize, DataTypes);
db.user = require("./user.js")(sequelize, DataTypes);
db.work = require("./work.js")(sequelize, DataTypes);
db.author = require("./author.js")(sequelize, DataTypes);
db.edition = require("./edition.js")(sequelize, DataTypes);
db.loan = require("./loan.js")(sequelize, DataTypes);
db.subject = require("./subject.js")(sequelize, DataTypes);
db.reservation = require("./reservation.js")(sequelize, DataTypes);
db.auditlog = require("./auditlog.js")(sequelize, DataTypes);
db.workauthor = require("./workauthor.js")(sequelize, DataTypes);
db.worksubject = require("./worksubject.js")(sequelize, DataTypes);

// --- SEOSTE KÄSITSI DEFINEERIMINE ---

// Work <-> Author (mitu-mitmele)
db.work.belongsToMany(db.author, {
  through: db.workauthor, // Kasutame mudelit, millel on timestamps: false
  as: "authors",
  foreignKey: 'workid'
});
db.author.belongsToMany(db.work, {
  through: db.workauthor,
  as: "works",
  foreignKey: 'authorid'
});

// Work <-> Subject (mitu-mitmele)
db.work.belongsToMany(db.subject, {
    through: db.worksubject, // Kasutame mudelit, millel on timestamps: false
    as: "subjects",
    foreignKey: 'workid'
});
db.subject.belongsToMany(db.work, {
    through: db.worksubject,
    as: "works",
    foreignKey: 'subjectid'
});

// Üks-mitmele seosed
db.role.hasMany(db.user, { foreignKey: 'roleid' });
db.user.belongsTo(db.role, { as: "role", foreignKey: 'roleid' });

db.work.hasMany(db.edition, { as: "editions", foreignKey: 'workid' });
db.edition.belongsTo(db.work, { as: "work", foreignKey: 'workid' });

db.user.hasMany(db.loan, { as: "loans", foreignKey: 'userid' });
db.loan.belongsTo(db.user, { as: "user", foreignKey: 'userid' });

db.edition.hasMany(db.loan, { as: "loans", foreignKey: 'editionid' });
db.loan.belongsTo(db.edition, { as: "edition", foreignKey: 'editionid' });

db.user.hasMany(db.reservation, { as: "reservations", foreignKey: 'userid' });
db.reservation.belongsTo(db.user, { as: "user", foreignKey: 'userid' });

db.work.hasMany(db.reservation, { as: "reservations", foreignKey: 'workid' });
db.reservation.belongsTo(db.work, { as: "work", foreignKey: 'workid' });

module.exports = db;