const db = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({
      attributes: ['userid', 'username', 'email', 'firstname', 'lastname', 'createdat'],
      include: {
        model: db.role,
        as: 'role',
        attributes: ['rolename']
      },
      order: [['userid', 'ASC']]
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Viga kasutajate pärimisel." });
  }
};