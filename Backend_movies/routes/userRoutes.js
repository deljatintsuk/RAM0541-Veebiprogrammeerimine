const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin saab lugeda kõiki kasutajaid (nõuab autentimist ja admin rolli)
router.get('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), userController.getAllUsers);
// Admin saab lugeda kasutajat ID järgi (nõuab autentimist ja admin rolli)
router.get('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), userController.getUserById);


// Admin saab luua, uuendada ja kustutada kasutajaid (nõuab autentimist ja admin rolli)
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['admin']), userController.createUser);
router.put('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.authorize(['admin']), userController.deleteUser);

// Siia võiks lisada marsruudid, kus kasutaja saab oma enda profiili vaadata või uuendada (kasutades authenticate, aga mitte isAdmin)
// router.get('/me', authMiddleware.authenticate, userController.getCurrentUser);
// router.put('/me', authMiddleware.authenticate, userController.updateCurrentUser);


module.exports = router;