// library-backend/controllers/reservation.controller.js
const db = require("../models");
const { sequelize, reservation, edition, loan, work } = db; // Lisa work mudel

exports.createReservation = async (req, res) => {
  const { workid } = req.body;
  const userid = req.userId;

  try {
    // 1. Kontrolli, et kasutajal pole juba aktiivset laenutust sellele teosele
    const existingLoan = await loan.findOne({ 
        where: { userid, returndate: null }, 
        include: [{ model: edition, as: 'edition', where: { workid } }]
    });
    if (existingLoan) {
        return res.status(400).send({ message: "Teil on see raamat juba laenutatud." });
    }

    // 2. Kontrolli, et kasutajal pole juba aktiivset broneeringut sellele teosele
    const existingReservation = await reservation.findOne({ 
        where: { userid, workid, status: 'Active' }
    });
    if (existingReservation) {
        return res.status(400).send({ message: "Teil on sellele raamatule juba aktiivne broneering." });
    }

    // 3. Kontrolli, et ühtegi eksemplari poleks saadaval
    const availableCopy = await edition.findOne({ 
        where: { workid, availability: 'Available' }
    });
    if (availableCopy) {
        return res.status(400).send({ message: "Sellel teosel on vabu eksemplare. Palun laenutage see." });
    }

    // 4. Loo uus broneering
    await reservation.create({ userid, workid });
    res.status(201).send({ message: "Broneering on edukalt loodud." });

  } catch (error) {
    // PARANDUS: Püüame kinni spetsiifilise "unique constraint" vea
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ message: "Teil on sellele teosele juba broneering (aktiivne või varasem)." });
    }
    // Logime serveri poolele tegeliku vea, et saaksime seda uurida
    console.error("Reservation creation error:", error);
    res.status(500).send({ message: "Broneerimisel tekkis ootamatu viga." });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const myReservations = await reservation.findAll({
      where: { userid: req.userId }, // Näitame kõiki, mitte ainult aktiivseid
      include: [{ model: work, as: 'work', attributes: ['title'] }],
      order: [['reservationdate', 'DESC']]
    });
    res.status(200).send(myReservations);
  } catch (error) {
    res.status(500).send({ message: "Viga broneeringute pärimisel." });
  }
};

exports.cancelReservation = async (req, res) => {
    const { reservationid } = req.params;
    const userid = req.userId;

    try {
        const reserv = await reservation.findByPk(reservationid);
        if (!reserv) {
            return res.status(404).send({ message: "Broneeringut ei leitud." });
        }
        if (reserv.userid !== userid) {
            return res.status(403).send({ message: "See ei ole teie broneering." });
        }
        // Ainult aktiivset broneeringut saab tühistada
        if (reserv.status !== 'Active') {
            return res.status(400).send({ message: "Seda broneeringut ei saa enam tühistada." });
        }

        await reserv.update({ status: 'Cancelled' });
        res.send({ message: "Broneering on tühistatud." });
    } catch(error) {
        res.status(500).send({ message: "Viga broneeringu tühistamisel." });
    }
};
exports.getAllReservations = async (req, res) => {
    try {
        const allReservations = await db.reservation.findAll({
            include: [
                { model: db.user, as: 'user', attributes: ['username'] },
                { model: db.work, as: 'work', attributes: ['title'] }
            ],
            order: [['reservationdate', 'DESC']]
        });
        res.status(200).send(allReservations);
    } catch (error) {
        console.error("Error fetching all reservations:", error);
        res.status(500).send({ message: "Viga kõikide broneeringute pärimisel." });
    }
};

exports.confirmReservation = async (req, res) => {
    const { reservationid } = req.params;
    const userid = req.userId;

    try {
        const reserv = await reservation.findOne({
            where: { reservationid, userid, status: 'PendingConfirmation' },
            include: 'work'
        });

        if (!reserv) {
            return res.status(404).send({ message: "Kinnitamiseks sobivat broneeringut ei leitud." });
        }

        // Leia broneeritud raamatu vaba eksemplar
        const reservedEdition = await db.edition.findOne({
            where: { workid: reserv.workid, availability: 'Reserved' }
        });

        if (!reservedEdition) {
            return res.status(404).send({ message: "Reserveeritud teavikut ei leitud. Palun võtke ühendust raamatukoguga." });
        }

        await sequelize.transaction(async (t) => {
            // 1. Loo uus laenutus
            const duedate = new Date();
            duedate.setDate(duedate.getDate() + 21);
            await db.loan.create({
                userid,
                editionid: reservedEdition.editionid,
                duedate
            }, { transaction: t });

            // 2. Muuda teaviku staatus 'OnLoan'
            await reservedEdition.update({ availability: 'OnLoan' }, { transaction: t });

            // 3. Märgi broneering täidetuks
            await reserv.update({ status: 'Fulfilled', fulfilleddate: new Date() }, { transaction: t });
        });

        res.send({ message: "Broneering on kinnitatud ja raamat lisatud teie laenutuste hulka." });

    } catch(error) {
        console.error("Confirmation error:", error);
        res.status(500).send({ message: "Viga broneeringu kinnitamisel." });
    }
};

// UUS FUNKTSIOON: Broneeringust loobumine
exports.declineReservation = async (req, res) => {
    const { reservationid } = req.params;
    const userid = req.userId;

    try {
        const reserv = await reservation.findOne({
            where: { reservationid, userid, status: 'PendingConfirmation' },
            include: 'work'
        });
        if (!reserv) { return res.status(404).send({ message: "Sobivat broneeringut ei leitud." });}

        await sequelize.transaction(async (t) => {
             // 1. Tühista praegune broneering
            await reserv.update({ status: 'Cancelled' }, { transaction: t });

            // 2. Leia vabanenud eksemplar
            const reservedEdition = await db.edition.findOne({
                where: { workid: reserv.workid, availability: 'Reserved' },
                transaction: t
            });
            
            // Kui eksemplari ei leita, on midagi valesti, aga jätkame
            if (!reservedEdition) return;

            // 3. Kontrolli, kas on järgmine broneering
            const nextReservation = await reservation.findOne({
                where: { workid: reserv.workid, status: 'Active' },
                order: [['reservationdate', 'ASC']],
                transaction: t
            });

            if (nextReservation) {
                const expirationTime = new Date();
                expirationTime.setHours(expirationTime.getHours() + 48);
                await nextReservation.update({ status: 'PendingConfirmation', offer_expires_at: expirationTime }, { transaction: t });
                // Teaviku staatus jääb 'Reserved'
            } else {
                await reservedEdition.update({ availability: 'Available' }, { transaction: t });
            }
        });

        res.send({ message: "Broneeringust on loobutud." });
        
    } catch(error) {
        console.error("Decline error:", error);
        res.status(500).send({ message: "Viga broneeringust loobumisel." });
    }
};