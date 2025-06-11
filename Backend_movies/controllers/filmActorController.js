const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)

const getAllFilmActors = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'actor_id', sortOrder = 'ASC' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await models.film_actor.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        { model: models.actor, as: 'actor' },
        { model: models.film, as: 'film' }
      ]
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      film_actors: rows,
    });
  } catch (error) {
    console.error('Film_actor kirjete hankimise viga:', error);
    return res.status(500).json({ message: 'Film_actor kirjete hankimine ebaõnnestus', error: error.message });
  }
};

const getFilmActorById = async (req, res) => {
  const { actorId, filmId } = req.params;
  try {
    const filmActorData = await models.film_actor.findOne({
      where: { actor_id: actorId, film_id: filmId },
      include: [
        { model: models.actor, as: 'actor' },
        { model: models.film, as: 'film' }
      ]
    });
    if (!filmActorData) {
      return res.status(404).json({ message: 'Film_actor kirjet ei leitud' });
    }
    return res.status(200).json(filmActorData);
  } catch (error) {
    console.error('Film_actor kirje info hankimise viga:', error);
    return res.status(500).json({ message: 'Film_actor kirje info hankimine ebaõnnestus', error: error.message });
  }
};

const createFilmActor = async (req, res) => {
  const { actor_id, film_id } = req.body;
  try {
    const newFilmActor = await models.film_actor.create({ actor_id, film_id });
    return res.status(201).json(newFilmActor);
  } catch (error) {
    console.error('Film_actor kirje loomise viga:', error);
    return res.status(500).json({ message: 'Film_actor kirje loomine ebaõnnestus', error: error.message });
  }
};

const deleteFilmActor = async (req, res) => {
  const { actorId, filmId } = req.params;
  try {
    const deletedRows = await models.film_actor.destroy({
      where: { actor_id: actorId, film_id: filmId },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Film_actor kirjet ei leitud' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Film_actor kirje kustutamise viga:', error);
    return res.status(500).json({ message: 'Film_actor kirje kustutamine ebaõnnestus', error: error.message });
  }
};

module.exports = {
  getAllFilmActors,
  getFilmActorById,
  createFilmActor,
  deleteFilmActor,
};