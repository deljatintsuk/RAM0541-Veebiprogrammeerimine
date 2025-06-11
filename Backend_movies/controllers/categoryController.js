const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)

const getAllCategories = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      const { count, rows } = await models.category.findAndCountAll({
        limit: parseInt(limit),
        offset: offset,
        order: [[sortBy, sortOrder.toUpperCase()]],
      });
  
      return res.status(200).json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        categories: rows,
      });
    } catch (error) {
      console.error('Kategooriate hankimise viga:', error);
      return res.status(500).json({ message: 'Kategooriate hankimine ebaõnnestus', error: error.message });
    }
  };
  
  const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
      const categoryData = await models.category.findByPk(id);
      if (!categoryData) {
        return res.status(404).json({ message: 'Kategooriat ei leitud' });
      }
      return res.status(200).json(categoryData);
    } catch (error) {
      console.error('Kategooria info hankimise viga:', error);
      return res.status(500).json({ message: 'Kategooria info hankimine ebaõnnestus', error: error.message });
    }
  };
  
  const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
      const newCategory = await models.category.create({ name });
      return res.status(201).json(newCategory);
    } catch (error) {
      console.error('Kategooria loomise viga:', error);
      return res.status(500).json({ message: 'Kategooria loomine ebaõnnestus', error: error.message });
    }
  };
  
  const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const [updatedRows] = await models.category.update({ name }, {
        where: { category_id: id },
      });
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'Kategooriat ei leitud' });
      }
      const updatedCategory = await models.category.findByPk(id);
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Kategooria info uuendamise viga:', error);
      return res.status(500).json({ message: 'Kategooria info uuendamine ebaõnnestus', error: error.message });
    }
  };
  
  const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedRows = await models.category.destroy({
        where: { category_id: id },
      });
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'Kategooriat ei leitud' });
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Kategooria kustutamise viga:', error);
      return res.status(500).json({ message: 'Kategooria kustutamine ebaõnnestus', error: error.message });
    }
  };
  
  module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };