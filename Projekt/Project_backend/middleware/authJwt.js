// middleware/authJwt.js
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token && token.startsWith('Bearer ')) token = token.slice(7, token.length);

  if (token) {
      jwt.verify(token, config.auth.secret, (err, decoded) => {
        if (!err) {
            req.userId = decoded.id;
        }
        next();
      });
  } else {
      next();
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await db.user.findByPk(req.userId);
    const role = await user.getRole();
    if (role.rolename === 'Admin') return next();
    res.status(403).send({ message: "Require Admin Role!" });
  } catch (error) {
    res.status(500).send({ message: "Unable to validate user role." });
  }
};

module.exports = { verifyToken, isAdmin };