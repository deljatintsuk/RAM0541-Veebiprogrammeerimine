const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik lugemine
router.get('/', actorController.getAllActors);
router.get('/:id', actorController.getActorById);

// Admini CRUD (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), actorController.createActor);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), actorController.updateActor);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), actorController.deleteActor);

module.exports = router;