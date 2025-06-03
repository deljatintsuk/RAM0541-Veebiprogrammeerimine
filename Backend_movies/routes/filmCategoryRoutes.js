const express = require('express');
const router = express.Router();
const filmCategoryController = require('../controllers/filmCategoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik lugemine
router.get('/', filmCategoryController.getAllFilmCategories);
router.get('/:filmId/:categoryId', filmCategoryController.getFilmCategoryById);

// Admini loomine ja kustutamine (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), filmCategoryController.createFilmCategory);
router.delete('/:filmId/:categoryId', authMiddleware.authenticate, authMiddleware.authorize(['admin']), filmCategoryController.deleteFilmCategory);

module.exports = router;