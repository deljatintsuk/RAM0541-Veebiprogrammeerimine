// routes/searchMovieRoutes.js
const express = require('express');
const router = express.Router();
const searchMovieController = require('../controllers/searchMovieController');

/**
 * @swagger
 * tags:
 * name: Movie Search
 * description: API filmide otsimiseks erinevate kriteeriumite järgi
 */

/**
 * @swagger
 * /movies/search/all:
 * get:
 * summary: Too kõik filmid
 * tags: [Movie Search]
 * responses:
 * 200:
 * description: Edukas operatsioon. Tagastab filmide massiivi.
 * schema:
 * type: array
 * items:
 * $ref: '#/definitions/Film'
 * 500:
 * description: Serveri viga
 */
router.get('/all', searchMovieController.getAllEntries);

/**
 * @swagger
 * /movies/search/titles:
 * get:
 * summary: Too kõik saadaolevad filmi pealkirjad
 * tags: [Movie Search]
 * responses:
 * 200:
 * description: Edukas operatsioon. Tagastab pealkirjade massiivi.
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * title:
 * type: string
 * example: "ACADEMY DINOSAUR"
 * 404:
 * description: Pealkirju ei leitud
 * 500:
 * description: Serveri viga
 */
router.get('/titles', searchMovieController.getAvailableTitles);

/**
 * @swagger
 * /movies/search/title/{titleName}:
 * get:
 * summary: Too filmid pealkirja järgi (osaline vaste)
 * tags: [Movie Search]
 * parameters:
 * - in: path
 * name: titleName
 * schema:
 * type: string
 * required: true
 * description: Filmi pealkirja osa
 * responses:
 * 200:
 * description: Edukas operatsioon. Tagastab filmide massiivi.
 * schema:
 * type: array
 * items:
 * $ref: '#/definitions/Film'
 * 404:
 * description: Filmi ei leitud selle pealkirjaga
 * 500:
 * description: Serveri viga
 */
router.get('/title/:titleName', searchMovieController.getByTitle);

/**
 * @swagger
 * /movies/search/languages:
 * get:
 * summary: Too kõik saadaolevad keeled
 * tags: [Movie Search]
 * responses:
 * 200:
 * description: Edukas operatsioon. Tagastab keelte massiivi.
 * schema:
 * type: array
 * items:
 * type: string
 * example: "English"
 * 404:
 * description: Keele ei leitud
 * 500:
 * description: Serveri viga
 */
router.get('/languages', searchMovieController.getAvailableLanguages);

/**
 * @swagger
 * /movies/search/language/{languageName}:
 * get:
 * summary: Too filmid keele järgi
 * tags: [Movie Search]
 * parameters:
 * - in: path
 * name: languageName
 * schema:
 * type: string
 * required: true
 * description: Keele nimi
 * responses:
 * 200:
 * description: Edukas operatsioon. Tagastab filmide massiivi.
 * schema:
 * type: array
 * items:
 * $ref: '#/definitions/Film'
 * 404:
 * description: Filmi ei leitud selle keelega
 * 500:
 * description: Serveri viga
 */
router.get('/language/:languageName', searchMovieController.getByLanguage);

/**
 * @swagger
 * /movies/search/categories:
 * get:
 * summary: Too kõik saadaolevad kategooriad
 * tags: [Movie Search]
 * responses:
 * 200:
 * description: Edukas operatsioon. Tagastab kategooriate massiivi.
 * schema:
 * type: array
 * items:
 * type: string
 * example: "Action"
 * 404:
 * description: Kategooriat ei leitud
 * 500:
 * description: Serveri viga
 */
router.get('/categories', searchMovieController.getAvailableCategories);

/**
 * @swagger
 * /movies/search/category/{categoryName}:
 * get:
 * summary: Too filmid kategooria järgi
 * tags: [Movie Search]
 * parameters:
 * - in: path
 * name: categoryName
 * schema:
 * type: string
 * required: true
 * description: Kategooria nimi
 * responses:
 * 200:
 * description: Edukas operatsioon. Tagastab filmide massiivi.
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * film:
 * $ref: '#/definitions/Film'
 * 404:
 * description: Filmi ei leitud selle kategooriaga
 * 500:
 * description: Serveri viga
 */
router.get('/category/:categoryName', searchMovieController.getByCategory);

module.exports = router;