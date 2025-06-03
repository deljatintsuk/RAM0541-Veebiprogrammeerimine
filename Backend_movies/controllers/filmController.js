const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)


const getAllFilms = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'title', sortOrder = 'ASC' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await models.film.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        { model: models.language, as: 'language' },
        { model: models.language, as: 'original_language' },
      ],
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      films: rows,
    });
  } catch (error) {
    console.error('Filmide hankimise viga:', error);
    return res.status(500).json({ message: 'Filmide hankimine ebaõnnestus', error: error.message });
  }
};

const getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const filmData = await models.film.findByPk(id, {
      include: [
        { model: models.language, as: 'language' },
        { model: models.language, as: 'original_language' },
        { model: models.actor, as: 'actor_id_actors' }, // Kontrolli, kas see as nimi on õige init-models.js failis
        { model: models.category, as: 'category_id_categories' }, // Kontrolli, kas see as nimi on õige init-models.js failis
      ],
    });
    if (!filmData) {
      return res.status(404).json({ message: 'Filmi ei leitud' });
    }
    return res.status(200).json(filmData);
  } catch (error) {
    console.error('Filmi info hankimise viga:', error);
    return res.status(500).json({ message: 'Filmi info hankimine ebaõnnestus', error: error.message });
  }
};

const createFilm = async (req, res) => {
  const { title, language_id } = req.body; // Kohanda vastavalt oma mudelile
  try {
    const newFilm = await models.film.create({ title, language_id });
    return res.status(201).json(newFilm);
  } catch (error) {
    console.error('Filmi loomise viga:', error);
    return res.status(500).json({ message: 'Filmi loomine ebaõnnestus', error: error.message });
  }
};

const updateFilm = async (req, res) => {
  const { id } = req.params;
  const { title, language_id } = req.body; // Kohanda vastavalt oma mudelile
  try {
    const [updatedRows] = await models.film.update({ title, language_id }, {
      where: { film_id: id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Filmi ei leitud' });
    }
    const updatedFilm = await models.film.findByPk(id);
    return res.status(200).json(updatedFilm);
  } catch (error) {
    console.error('Filmi uuendamise viga:', error);
    return res.status(500).json({ message: 'Filmi info uuendamine ebaõnnestus', error: error.message });
  }
};

const deleteFilm = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await models.film.destroy({
      where: { film_id: id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Filmi ei leitud' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Filmi kustutamise viga:', error);
    return res.status(500).json({ message: 'Filmi kustutamine ebaõnnestus', error: error.message });
  }
};

module.exports = {
  getAllFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm,
};