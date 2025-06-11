const db = require("../models");
const { sequelize, loan, edition, work, user, reservation } = db;

exports.createLoan = async (req, res) => {
  const { editionid } = req.body;
  const userid = req.userId;
  try {
    // Andmebaasi protseduur teeb vajalikud kontrollid
    await sequelize.query(
      "CALL libraryapp.sp_processnewloan(:p_userid, :p_editionid)",
      {
        replacements: { p_userid: userid, p_editionid: editionid },
      }
    );
    res.status(201).send({ message: "Loan processed successfully." });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.original?.message || "Could not process loan." });
  }
};

exports.processReturn = async (req, res) => {
  const { editionid } = req.body;
  const userid = req.userId;

  try {
    const activeLoan = await loan.findOne({
      where: { editionid: editionid, returndate: null },
      include: { model: edition, as: "edition" }, // Kaasame edition info, et saada workid
    });

    if (!activeLoan) {
      return res
        .status(404)
        .send({ message: "Sellel väljaandel puudub aktiivne laenutus." });
    }

    const userMakingRequest = await user.findByPk(userid, { include: "role" });
    const isOwner = activeLoan.userid === userid;
    const isAdmin = userMakingRequest.role.rolename === "Admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .send({ message: "Teil pole õigust seda laenutust tagastada." });
    }

    await sequelize.transaction(async (t) => {
      await activeLoan.update({ returndate: new Date() }, { transaction: t });

      const nextReservation = await reservation.findOne({
        where: { workid: activeLoan.edition.workid, status: "Active" },
        order: [["reservationdate", "ASC"]],
        transaction: t,
      });

      if (nextReservation) {
        await edition.update(
          { availability: "Reserved" },
          { where: { editionid }, transaction: t }
        );
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 48);
        await nextReservation.update(
          {
            status: "PendingConfirmation",
            offer_expires_at: expirationTime,
          },
          { transaction: t }
        );
        console.log(
          `Broneering ID ${nextReservation.reservationid} on nüüd ootel. Aegub: ${expirationTime}`
        );
      } else {
        await edition.update(
          { availability: "Available" },
          { where: { editionid }, transaction: t }
        );
      }
    });

    res.status(200).send({ message: "Raamat on edukalt tagastatud." });
  } catch (error) {
    console.error("Return processing error:", error);
    res.status(500).send({ message: "Tagastamisel tekkis ootamatu viga." });
  }
};

exports.getMyLoans = async (req, res) => {
  try {
    const myLoans = await loan.findAll({
      where: { userid: req.userId, returndate: null },
      include: [
        {
          model: edition,
          as: "edition",
          attributes: ["editionid"],
          include: [{ model: work, as: "work", attributes: ["title"] }],
        },
      ],
      order: [["duedate", "ASC"]],
    });
    res.status(200).send(myLoans);
  } catch (error) {
    res.status(500).send({ message: "Viga laenutuste pärimisel." });
  }
};

exports.getOverdueLoans = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT * FROM libraryapp.vw_overdue_loans"
    );
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving overdue loans." });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const allLoans = await db.loan.findAll({
      // Kaasame kõik vajalikud seotud andmed
      include: [
        {
          model: db.user,
          as: "user",
          attributes: ["username"],
        },
        {
          model: db.edition,
          as: "edition",
          attributes: ["editionid"],
          include: [
            {
              model: db.work,
              as: "work",
              attributes: ["title"],
            },
          ],
        },
      ],
      order: [["loandate", "DESC"]],
    });
    res.status(200).send(allLoans);
  } catch (error) {
    console.error("Error fetching all loans:", error);
    res.status(500).send({ message: "Viga kõikide laenutuste pärimisel." });
  }
};
