const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)


const getAllFilmCategories = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'film_id', sortOrder = 'ASC' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await models.film_category.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        { model: models.film, as: 'film' },
        { model: models.category, as: 'category' }
      ]
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      film_categories: rows,
    });
  } catch (error) {
    console.error('Film_category kirjete hankimise viga:', error);
    return res.status(500).json({ message: 'Film_category kirjete hankimine ebaõnnestus', error: error.message });
  }
};

const getFilmCategoryById = async (req, res) => {
  const { filmId, categoryId } = req.params;
  try {
    const filmCategoryData = await models.film_category.findOne({
      where: { film_id: filmId, category_id: categoryId },
      include: [
        { model: models.film, as: 'film' },
        { model: models.category, as: 'category' }
      ]
    });
    if (!filmCategoryData) {
      return res.status(404).json({ message: 'Film_category kirjet ei leitud' });
    }
    return res.status(200).json(filmCategoryData);
  } catch (error) {
    console.error('Film_category kirje info hankimise viga:', error);
    return res.status(500).json({ message: 'Film_category kirje info hankimine ebaõnnestus', error: error.message });
  }
};

const createFilmCategory = async (req, res) => {
  const { film_id, category_id } = req.body;
  try {
    const newFilmCategory = await models.film_category.create({ film_id, category_id });
    return res.status(201).json(newFilmCategory);
  } catch (error) {
    console.error('Film_category kirje loomise viga:', error);
    return res.status(500).json({ message: 'Film_category kirje loomine ebaõnnestus', error: error.message });
  }
};

const deleteFilmCategory = async (req, res) => {
  const { filmId, categoryId } = req.params;
  try {
    const deletedRows = await models.film_category.destroy({
      where: { film_id: filmId, category_id: categoryId },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Film_category kirjet ei leitud' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Film_category kirje kustutamise viga:', error);
    return res.status(500).json({ message: 'Film_category kirje kustutamine ebaõnnestus', error: error.message });
  }
};

module.exports = {
  getAllFilmCategories,
  getFilmCategoryById,
  createFilmCategory,
  deleteFilmCategory,
};