const db = require("../models");

// Abifunktsioon, mis lisab sisseloginud kasutaja laenutuse/broneeringu info
const addUserDataToEditions = async (editions, userId) => {
    // Kui kasutaja pole sisse logitud või andmeid pole, ära tee midagi ekstra
    if (!userId || !Array.isArray(editions) || editions.length === 0) {
        return editions.map(e => ({ ...(e.get ? e.get({ plain: true }) : e), currentUserHasLoan: false, currentUserHasReservation: false }));
    }

    // Leia kõik unikaalsed teoste ID-d
    const workIds = [...new Set(editions.map(e => e.workid))];

    // Leia kasutaja aktiivsed laenutused ja broneeringud nende teoste kohta
    const userLoans = await db.loan.findAll({
        where: { userid: userId, returndate: null },
        include: [{ model: db.edition, as: 'edition', where: { workid: workIds } }]
    });
    const userReservations = await db.reservation.findAll({
        where: { userid: userId, workid: workIds, status: 'Active' }
    });

    // Loo Set'id kiireks kontrolliks
    const loanedWorkIds = new Set(userLoans.map(l => l.edition.workid));
    const reservedWorkIds = new Set(userReservations.map(r => r.workid));

    // Lisa igale teavikule vastav info
    return editions.map(e => {
        const plainEdition = e.get ? e.get({ plain: true }) : e; // Veakindlus toor-SQL päringute jaoks
        return {
            ...plainEdition,
            currentUserHasLoan: loanedWorkIds.has(plainEdition.workid),
            currentUserHasReservation: reservedWorkIds.has(plainEdition.workid)
        };
    });
};

// KUVAB KÕIK TEAVIKUD
exports.findAllDetailed = async (req, res) => {
    try {
        const [results] = await db.sequelize.query("SELECT * FROM libraryapp.vw_detailed_editions ORDER BY title");
        const editionsWithUserData = await addUserDataToEditions(results, req.userId);
        res.status(200).send(editionsWithUserData);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving detailed editions." });
    }
};

// OTSIB TEAVIKUID
exports.search = async (req, res) => {
    const query = req.query.q;
    if (!query || query.trim() === "") {
        return exports.findAllDetailed(req, res);
    }

    try {
        const searchWords = query.trim().split(' ').filter(word => word.length > 0);
        const replacements = {};
        const whereClauses = searchWords.map((word, index) => {
            const key = `query${index}`;
            replacements[key] = `%${word}%`;
            return `(title ILIKE :${key} OR authors ILIKE :${key} OR subjects ILIKE :${key})`;
        });

        const whereString = whereClauses.join(' AND ');
        const sqlQuery = `SELECT * FROM libraryapp.vw_detailed_editions WHERE ${whereString} ORDER BY title`;
        
        const results = await db.sequelize.query(sqlQuery, {
            replacements: replacements,
            type: db.sequelize.QueryTypes.SELECT
        });

        const editionsWithUserData = await addUserDataToEditions(results, req.userId);
        res.status(200).send(editionsWithUserData);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).send({ message: "Otsingul tekkis viga." });
    }
};

// KUVAB ÜHE TEAVIKU DETAILID (SEE FUNKTSIOON OLI PUUDU)
exports.findOne = async (req, res) => {
    try {
        const work = await db.work.findByPk(req.params.id, {
            include: [
                { association: "authors", through: { attributes: [] } },
                { association: "subjects", through: { attributes: [] } },
                { association: "editions" }
            ]
        });
        if (work) return res.status(200).send(work);
        res.status(404).send({ message: "Work not found." });
    } catch (error) {
        console.error("Error finding one work:", error);
        res.status(500).send({ message: "Error retrieving work." });
    }
};