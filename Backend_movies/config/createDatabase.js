const express = require("express");
const sequelize = require("./database");
const models = require("../models")

const sync = async () => await sequelize.sync({ force: true });
sync().then(() => {
  models.roles.create({ name: "admin" });
  models.roles.create({ name: "user" });
  models.users.create({
    email: "test@test.com",
    password: "123456",
    username: "admin",
    role_id: 1
  }); 

});
