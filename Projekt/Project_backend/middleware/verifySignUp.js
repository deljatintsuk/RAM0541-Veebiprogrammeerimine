// middleware/verifySignUp.js
const db = require("../models");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await db.user.findOne({ where: { username: req.body.username } });
    if (userByUsername) return res.status(400).send({ message: "Failed! Username is already in use!" });

    const userByEmail = await db.user.findOne({ where: { email: req.body.email } });
    if (userByEmail) return res.status(400).send({ message: "Failed! Email is already in use!" });
    
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { checkDuplicateUsernameOrEmail };