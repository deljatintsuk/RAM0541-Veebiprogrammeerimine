const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)


const getAllLanguages = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await models.language.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      languages: rows,
    });
  } catch (error) {
    console.error('Keelte hankimise viga:', error);
    return res.status(500).json({ message: 'Keelte hankimine ebaõnnestus', error: error.message });
  }
};

const getLanguageById = async (req, res) => {
  const { id } = req.params;
  try {
    const languageData = await models.language.findByPk(id);
    if (!languageData) {
      return res.status(404).json({ message: 'Keelt ei leitud' });
    }
    return res.status(200).json(languageData);
  } catch (error) {
    console.error('Keele info hankimise viga:', error);
    return res.status(500).json({ message: 'Keele info hankimine ebaõnnestus', error: error.message });
  }
};

const createLanguage = async (req, res) => {
  const { name } = req.body;
  try {
    const newLanguage = await models.language.create({ name });
    return res.status(201).json(newLanguage);
  } catch (error) {
    console.error('Keele loomise viga:', error);
    return res.status(500).json({ message: 'Keele loomine ebaõnnestus', error: error.message });
  }
};

const updateLanguage = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const [updatedRows] = await models.language.update({ name }, {
      where: { language_id: id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Keelt ei leitud' });
    }
    const updatedLanguage = await models.language.findByPk(id);
    return res.status(200).json(updatedLanguage);
  } catch (error) {
    console.error('Keele info uuendamise viga:', error);
    return res.status(500).json({ message: 'Keele info uuendamine ebaõnnestus', error: error.message });
  }
};

const deleteLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await models.language.destroy({
      where: { language_id: id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Keelt ei leitud' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Keele kustutamise viga:', error);
    return res.status(500).json({ message: 'Keele kustutamine ebaõnnestus', error: error.message });
  }
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};