const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik lugemine
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);

// Admini CRUD (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), roleController.createRole);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), roleController.updateRole);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), roleController.deleteRole);

module.exports = router;