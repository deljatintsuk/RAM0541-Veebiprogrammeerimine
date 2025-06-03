const express = require('express');
const router = express.Router();
const filmActorController = require('../controllers/filmActorController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik lugemine
router.get('/', filmActorController.getAllFilmActors);
router.get('/:actorId/:filmId', filmActorController.getFilmActorById);

// Admini loomine ja kustutamine (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), filmActorController.createFilmActor);
router.delete('/:actorId/:filmId', authMiddleware.authenticate, authMiddleware.authorize(['admin']), filmActorController.deleteFilmActor);

module.exports = router;