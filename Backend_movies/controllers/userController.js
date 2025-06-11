const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)

const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'username', sortOrder = 'ASC' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await models.users.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: { model: models.roles, as: 'role' }, // Kaasa rolli info
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: rows,
    });
  } catch (error) {
    console.error('Kasutajate hankimise viga:', error);
    return res.status(500).json({ message: 'Kasutajate hankimine ebaõnnestus', error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const userData = await models.users.findByPk(id, { include: { model: models.roles, as: 'role' } }); // Kaasa rolli info
    if (!userData) {
      return res.status(404).json({ message: 'Kasutajat ei leitud' });
    }
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Kasutaja info hankimise viga:', error);
    return res.status(500).json({ message: 'Kasutaja info hankimine ebaõnnestus', error: error.message });
  }
};

const createUser = async (req, res) => {
  const { email, username, password, role_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await models.users.create({ email, username, password: hashedPassword, role_id });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Kasutaja loomise viga:', error);
    return res.status(500).json({ message: 'Kasutaja loomine ebaõnnestus', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, password, role_id } = req.body;
  try {
    const updateData = { email, username, role_id };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const [updatedRows] = await models.users.update(updateData, {
      where: { id: id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Kasutajat ei leitud' });
    }
    const updatedUser = await models.users.findByPk(id, { include: { model: models.roles, as: 'role' } }); // Kaasa rolli info
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Kasutaja info uuendamise viga:', error);
    return res.status(500).json({ message: 'Kasutaja info uuendamine ebaõnnestus', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await models.users.destroy({
      where: { id: id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Kasutajat ei leitud' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Kasutaja kustutamise viga:', error);
    return res.status(500).json({ message: 'Kasutaja kustutamine ebaõnnestus', error: error.message });
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};