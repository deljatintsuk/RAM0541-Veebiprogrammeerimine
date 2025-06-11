var DataTypes = require("sequelize").DataTypes;
var _auditlog = require("./auditlog");
var _author = require("./author");
var _edition = require("./edition");
var _loan = require("./loan");
var _reservation = require("./reservation");
var _role = require("./role");
var _subject = require("./subject");
var _user = require("./user");
var _workauthor = require("./workauthor");
var _work = require("./work");
var _worksubject = require("./worksubject");

function initModels(sequelize) {
  var auditlog = _auditlog(sequelize, DataTypes);
  var author = _author(sequelize, DataTypes);
  var edition = _edition(sequelize, DataTypes);
  var loan = _loan(sequelize, DataTypes);
  var reservation = _reservation(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var subject = _subject(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var workauthor = _workauthor(sequelize, DataTypes);
  var work = _work(sequelize, DataTypes);
  var worksubject = _worksubject(sequelize, DataTypes);

  author.belongsToMany(work, { as: 'workid_works', through: workauthor, foreignKey: "authorid", otherKey: "workid" });
  subject.belongsToMany(work, { as: 'workid_works_worksubjects', through: worksubject, foreignKey: "subjectid", otherKey: "workid" });
  work.belongsToMany(author, { as: 'authorid_authors', through: workauthor, foreignKey: "workid", otherKey: "authorid" });
  work.belongsToMany(subject, { as: 'subjectid_subjects', through: worksubject, foreignKey: "workid", otherKey: "subjectid" });
  workauthor.belongsTo(author, { as: "author", foreignKey: "authorid"});
  author.hasMany(workauthor, { as: "workauthors", foreignKey: "authorid"});
  loan.belongsTo(edition, { as: "edition", foreignKey: "editionid"});
  edition.hasMany(loan, { as: "loans", foreignKey: "editionid"});
  user.belongsTo(role, { as: "role", foreignKey: "roleid"});
  role.hasMany(user, { as: "users", foreignKey: "roleid"});
  worksubject.belongsTo(subject, { as: "subject", foreignKey: "subjectid"});
  subject.hasMany(worksubject, { as: "worksubjects", foreignKey: "subjectid"});
  loan.belongsTo(user, { as: "user", foreignKey: "userid"});
  user.hasMany(loan, { as: "loans", foreignKey: "userid"});
  reservation.belongsTo(user, { as: "user", foreignKey: "userid"});
  user.hasMany(reservation, { as: "reservations", foreignKey: "userid"});
  edition.belongsTo(work, { as: "work", foreignKey: "workid"});
  work.hasMany(edition, { as: "editions", foreignKey: "workid"});
  reservation.belongsTo(work, { as: "work", foreignKey: "workid"});
  work.hasMany(reservation, { as: "reservations", foreignKey: "workid"});
  workauthor.belongsTo(work, { as: "work", foreignKey: "workid"});
  work.hasMany(workauthor, { as: "workauthors", foreignKey: "workid"});
  worksubject.belongsTo(work, { as: "work", foreignKey: "workid"});
  work.hasMany(worksubject, { as: "worksubjects", foreignKey: "workid"});

  return {
    auditlog,
    author,
    edition,
    loan,
    reservation,
    role,
    subject,
    user,
    workauthor,
    work,
    worksubject,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
