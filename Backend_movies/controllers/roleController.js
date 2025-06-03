const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)

const getAllRoles = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      const { count, rows } = await models.roles.findAndCountAll({
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
      });
  
      return res.status(200).json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        roles: rows,
      });
    } catch (error) {
      console.error('Rollide hankimise viga:', error);
      return res.status(500).json({ message: 'Rollide hankimine ebaõnnestus', error: error.message });
    }
  };
  
  const getRoleById = async (req, res) => {
    const { id } = req.params;
    try {
      const roleData = await models.roles.findByPk(id);
      if (!roleData) {
        return res.status(404).json({ message: 'Rolli ei leitud' });
      }
      return res.status(200).json(roleData);
    } catch (error) {
      console.error('Rolli info hankimise viga:', error);
      return res.status(500).json({ message: 'Rolli info hankimine ebaõnnestus', error: error.message });
    }
  };
  
  const createRole = async (req, res) => {
    const { name } = req.body;
    try {
      const newRole = await models.roles.create({ name });
      return res.status(201).json(newRole);
    } catch (error) {
      console.error('Rolli loomise viga:', error);
      return res.status(500).json({ message: 'Rolli loomine ebaõnnestus', error: error.message });
    }
  };
  
  const updateRole = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const [updatedRows] = await models.roles.update({ name }, {
        where: { id: id },
      });
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'Rolli ei leitud' });
      }
      const updatedRole = await models.roles.findByPk(id);
      return res.status(200).json(updatedRole);
    } catch (error) {
      console.error('Rolli info uuendamise viga:', error);
      return res.status(500).json({ message: 'Rolli info uuendamine ebaõnnestus', error: error.message });
    }
  };
  
  const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedRows = await models.roles.destroy({
        where: { id: id },
      });
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'Rolli ei leitud' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Rolli kustutamise viga:', error);
      return res.status(500).json({ message: 'Rolli kustutamine ebaõnnestus', error: error.message });
    }
  };
  
  module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
  };