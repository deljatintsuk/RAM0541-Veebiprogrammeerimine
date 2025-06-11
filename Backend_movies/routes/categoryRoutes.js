const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik lugemine
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admini CRUD (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), categoryController.createCategory);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), categoryController.updateCategory);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), categoryController.deleteCategory);

module.exports = router;