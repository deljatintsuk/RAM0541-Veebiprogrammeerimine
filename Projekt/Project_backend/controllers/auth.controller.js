// controllers/auth.controller.js
const db = require("../models");
const config = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const lugejaRole = await db.role.findOne({ where: { rolename: 'Lugeja' } });
    await db.user.create({
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      passwordhash: bcrypt.hashSync(req.body.password, 8),
      roleid: lugejaRole.roleid
    });
    res.send({ message: "User was registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { username: req.body.username }, include: 'role' });
    if (!user) return res.status(404).send({ message: "User Not found." });

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordhash);
    if (!passwordIsValid) return res.status(401).send({ accessToken: null, message: "Invalid Password!" });

    const token = jwt.sign({ id: user.userid }, config.auth.secret, { expiresIn: 86400 });
    res.status(200).send({
      id: user.userid,
      username: user.username,
      email: user.email,
      role: user.role.rolename,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};