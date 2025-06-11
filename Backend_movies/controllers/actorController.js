const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)


const getAllActors = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'first_name', sortOrder = 'ASC' } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await models.actor.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      actors: rows,
    });
  } catch (error) {
    console.error('Näitlejate hankimise viga:', error);
    return res.status(500).json({ message: 'Näitlejate hankimine ebaõnnestus', error: error.message });
  }
};

const getActorById = async (req, res) => {
  const { id } = req.params;
  try {
    const actorData = await models.actor.findByPk(id);
    if (!actorData) {
      return res.status(404).json({ message: 'Näitlejat ei leitud' });
    }
    return res.status(200).json(actorData);
  } catch (error) {
    console.error('Näitleja info hankimise viga:', error);
    return res.status(500).json({ message: 'Näitleja info hankimine ebaõnnestus', error: error.message });
  }
};

const createActor = async (req, res) => {
  const { first_name, last_name } = req.body;
  try {
    const newActor = await models.actor.create({ first_name, last_name });
    return res.status(201).json(newActor);
  } catch (error) {
    console.error('Näitleja loomise viga:', error);
    return res.status(500).json({ message: 'Näitleja loomine ebaõnnestus', error: error.message });
  }
};

const updateActor = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name } = req.body;
  try {
    const [updatedRows] = await models.actor.update({ first_name, last_name }, {
      where: { actor_id: id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Näitlejat ei leitud' });
    }
    const updatedActor = await models.actor.findByPk(id);
    return res.status(200).json(updatedActor);
  } catch (error) {
    console.error('Näitleja info uuendamise viga:', error);
    return res.status(500).json({ message: 'Näitleja info uuendamine ebaõnnestus', error: error.message });
  }
};

const deleteActor = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRows = await models.actor.destroy({
      where: { actor_id: id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Näitlejat ei leitud' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Näitleja kustutamise viga:', error);
    return res.status(500).json({ message: 'Näitleja kustutamine ebaõnnestus', error: error.message });
  }
};

module.exports = {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
};