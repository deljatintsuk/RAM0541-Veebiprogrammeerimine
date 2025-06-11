const express = require('express');
const router = express.Router();
const filmController = require('../controllers/filmController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik lugemine
router.get('/', filmController.getAllFilms);
router.get('/:id', filmController.getFilmById);

// Admini CRUD (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), filmController.createFilm);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), filmController.updateFilm);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), filmController.deleteFilm);

module.exports = router;