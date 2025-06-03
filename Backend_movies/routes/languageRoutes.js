const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik lugemine
router.get('/', languageController.getAllLanguages);
router.get('/:id', languageController.getLanguageById);

// Admini CRUD (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), languageController.createLanguage);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), languageController.updateLanguage);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), languageController.deleteLanguage);

module.exports = router;