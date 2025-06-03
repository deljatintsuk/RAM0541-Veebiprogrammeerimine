const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const initModels = require("../models/init-models");
const models = initModels(db);

// ✅ LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Kasutajanimi ja parool on kohustuslikud.' });
  }

  try {
    const user = await models.users.findOne({
      where: { username },
      include: [{ model: models.roles, as: 'role' }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Vale kasutajanimi või parool' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Vale kasutajanimi või parool' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role?.name || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Sisselogimine õnnestus',
      token,
    });
  } catch (error) {
    console.error('Sisselogimise viga:', error);
    return res.status(500).json({ message: 'Serveri viga' });
  }
};

// ✅ ADMIN SIGNUP
const adminSignup = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Kõik väljad on kohustuslikud.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await models.users.create({
      email,
      username,
      password: hashedPassword,
      role_id: 1, // Eeldab, et rolli ID 1 = admin
    });

    return res.status(201).json({
      message: 'Admin kasutaja loodud edukalt',
      userId: newAdmin.id,
    });
  } catch (error) {
    console.error('Admin kasutaja loomise viga:', error);
    return res.status(500).json({ message: 'Serveri viga' });
  }
};

// ✅ USER SIGNUP
const signup = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Kõik väljad on kohustuslikud.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await models.users.create({
      email,
      username,
      password: hashedPassword,
      role_id: 2, // Eeldab, et rolli ID 2 = tavakasutaja
    });

    return res.status(201).json({
      message: 'Kasutaja loodud edukalt',
      userId: newUser.id,
    });
  } catch (error) {
    console.error('Kasutaja loomise viga:', error);
    return res.status(500).json({ message: 'Serveri viga' });
  }
};

module.exports = {
  login,
  adminSignup,
  signup,
};
