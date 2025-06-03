const jwt = require('jsonwebtoken');
const db = require('../config/database');
const initModels = require('../models/init-models');
const models = initModels(db);

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Autentimine puudub. Palun sisesta token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lisa kasutaja info päringule
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token aegus. Palun logi uuesti sisse.' });
        }
        return res.status(401).json({ message: 'Token on vigane või puudub. Ligipääs keelatud.' });
    }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Kasutaja andmed puuduvad. Autentimine nõutud.' });
        }

        try {
            const user = await models.users.findByPk(req.user.id, {
                include: { model: models.roles, as: 'role' },
            });

            if (!user) {
                return res.status(404).json({ message: 'Kasutajat ei leitud.' });
            }

            console.log('Kasutaja info:', user.toJSON()); // Logime kasutaja andmed
            console.log('Kasutaja roll:', user.role ? user.role.name : null);

            // Kui rolle ei ole määratud, lubame autentitud kasutajal edasi minna
            if (roles.length === 0) {
                return next();
            }

            // Kontrollime rolli case-insensitive viisil
            const allowedRoles = roles.map(r => r.toLowerCase());
            const userRole = user.role ? user.role.name.toLowerCase() : null;

            if (userRole && allowedRoles.includes(userRole)) {
                return next();
            } else {
                return res.status(403).json({ message: 'Ligipääs keelatud. Teil puudub vajalik roll.' });
            }
        } catch (error) {
            console.error('Autoriseerimise viga:', error);
            return res.status(500).json({ message: 'Autoriseerimise viga' });
        }
    };
};

module.exports = {
    authenticate,
    authorize,
};
