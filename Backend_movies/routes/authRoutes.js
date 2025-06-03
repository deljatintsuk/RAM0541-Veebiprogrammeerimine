const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Avalik sisselogimine
router.post('/login', authController.login);

// Avalik kasutaja registreerimine
router.post('/signup', authController.signup);

// Admini registreerimine (nõuab autentimist ja admin rolli)
router.post('/signup-admin', authMiddleware.authorize(['admin']), authController.adminSignup);

module.exports = router;