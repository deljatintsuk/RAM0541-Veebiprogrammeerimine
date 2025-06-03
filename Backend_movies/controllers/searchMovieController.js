const db = require('../config/database')
const initModels = require("../models/init-models")
const models = initModels(db)
const sequelize = require('../config/database')
const { Op } = require("sequelize");

// Get all movies
exports.getAllEntries = async (req, res) => {
    try {
        const films = await models.film.findAll()
        res.status(200).json(films)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred while fetching movies' })
    }
}

// router.get('/title/', filmCategoryController.getAvailableTitles)
exports.getAvailableTitles = async (req, res) => {
    try {
        const titles = await models.film.findAll({
            attributes: ['title'],
            group: ['title'] // DISTINCT
        });

        if (titles.length === 0) {
            return res.status(404).json({ message: 'No titles found' });
        }

        res.status(200).json(titles);
    } catch (error) {
        console.error('Error fetching distinct language names:', error);
        res.status(500).json({ message: 'An error occurred while fetching language names' });
    }
}

// router.get('/title/:title', filmCategoryController.getByTitle)
exports.getByTitle = async (req, res) => {
    const { titleName } = req.params
    try {
        const films = await models.film.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${titleName}%`
                }
            }
        })

        // Checking if the list empty
        try {
            if (films.length === 0) {
                return res.status(404).json({ message: 'No such movies are found' });
            }
        }
        catch (error) { }

        res.status(200).json(films)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred while fetching movie information' })
    }
}

exports.getActorListByTitle = async (req, res) => {
    const { titleName } = req.params

    try {
        // Using raw query
        const ActorArray = await sequelize.query(
            `SELECT actor.*
            FROM movies.film as film
                INNER JOIN movies.film_actor as film_actor
                    ON film.film_id = film_actor.film_id
                INNER JOIN movies.actor as actor
                    ON film_actor.actor_id = actor.actor_id
            WHERE film.title ILIKE :titleName`,
            {
                replacements: { titleName: `%${titleName}%` },
                type: sequelize.QueryTypes.SELECT,
                plain: false
            })

        // Check if ActorArray is empty
        if (ActorArray.length === 0) {
            return res.status(404).json({ message: 'No films found for that actor' });
        }

        res.status(200).json(ActorArray)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'An error occurred while fetching actor list' })
    }
}

// router.get('/actor/', filmCategoryController.getAvailableActors)
exports.getAvailableActors = async (req, res) => {
    try {
        const actors = await models.actor.findAll({
            attributes: [
                [sequelize.fn('CONCAT', sequelize.col('first_name'), ' ', sequelize.col('last_name')), 'name']
            ],
            include: [{
                model: models.film_actor,
                required: true,
                as: 'film_actors',
                attributes: [] // Не включаем столбцы из film_actor
            }],
            distinct: true
        });

        if (actors.length === 0) {
            return res.status(404).json({ message: 'No actors found' });
        }

        const actorNames = actors.map(actor => actor.dataValues.name); // Извлекаем имена из результатов

        res.status(200).json(actorNames);
    } catch (error) {
        console.error('Error fetching distinct actors names:', error);
        res.status(500).json({ message: 'An error occurred while fetching distinct actors names' });
    }
}

// router.get('/actor/:actor', filmCategoryController.getByActor)
exports.getByActor = async (req, res) => {
    const { actorName } = req.params;

    try {
        const filmsArray = await sequelize.query(
            `SELECT film.*
            FROM movies.actor as actor
            INNER JOIN movies.film_actor as film_actor
                ON actor.actor_id = film_actor.actor_id        
            INNER JOIN movies.film as film
                ON film_actor.film_id = film.film_id
            WHERE first_name || ' ' || last_name ILIKE :actorName`,
            {
                replacements: { actorName: `%${actorName}%` },
                type: sequelize.QueryTypes.SELECT,
                plain: false, 
            }
        );

        // Check if filmsArray is empty
        if (filmsArray.length === 0) {
            return res.status(404).json({ message: 'No films found for that actor' });
        }

        res.status(200).json(filmsArray);
    } catch (error) {
        console.error('Error fetching films by actor name:', error);
        res.status(500).json({ message: 'An error occurred while fetching films by actor name' });
    }
};

// router.get('/language/', filmCategoryController.getAvailableLanguages)
exports.getAvailableLanguages = async (req, res) => {
    try {
        const languages = await models.language.findAll({
            attributes: ['name'],
            group: ['name'] // DISTINCT
        });

        if (languages.length === 0) {
            return res.status(404).json({ message: 'No languages found' });
        }

        // Converting to list and trimming unnessecary spaces
        const languageList = languages.map(language => language.name.trim());

        res.status(200).json(languageList);
    } catch (error) {
        console.error('Error fetching distinct language names:', error);
        res.status(500).json({ message: 'An error occurred while fetching language names' });
    }
}

exports.getByLanguage = async (req, res) => {
    const { languageName } = req.params

    try {
        // Looking for language ID
        const language_id_query = await models.language.findOne({
            attributes: ['language_id'],
            where: {
                name: {
                    [Op.iLike]: `%${languageName}%`
                }
            }
        })

        if (!language_id_query) {
            return res.status(404).json({ message: 'No such language found' });
        }

        // Using language_id to filter movies
        const movies = await models.film.findAll({
            where: {
                language_id: language_id_query.language_id
            }

        })

        res.status(200).json(movies);
    }
    catch (error) {
        console.error('Error fetching movies by language:', error);
        res.status(500).json({ message: 'An error occurred while fetching movies by language' });
    }
}


exports.getAvailableCategories = async (req, res) => {
    try {
        const categories = await models.category.findAll({
            attributes: ['name'],
            group: ['name'] // DISTINCT
        });

        if (!categories) {
            return res.status(404).json({ message: 'No categories found' });
        }

        // Converting to list and trimming unnessecary spaces
        const categoryList = categories.map(language => language.name.trim());

        res.status(200).json(categoryList);
    } catch (error) {
        console.error('Error fetching category names:', error);
        res.status(500).json({ message: 'An error occurred while fetching category names' });
    }
}

exports.getByCategory = async (req, res) => {
    const { categoryName } = req.params

    try {
        // Looking for category ID
        const category_id_query = await models.category.findOne({
            attributes: ['category_id'],
            where: {
                name: {
                    [Op.iLike]: `%${categoryName}%`
                }
            }
        })


        if (!category_id_query) {
            return res.status(404).json({ message: 'No such category found' });
        }


        // Looking for films by using foreign key connection
        const movies = await models.film_category.findAll({
            attributes: { exclude: ['film_id', 'category_id', 'last_update'] },
            where: {
                category_id: category_id_query.category_id,
            },
            include: [{
                model: models.film,
                as: 'film', // Using pseudonim used in model/init-models.js
                required: true,
            }],
        });

        res.status(200).json(movies);
    }
    catch (error) {
        console.error('Error fetching movies by category:', error);
        res.status(500).json({ message: 'An error occurred while fetching movies by category' });
    }
}