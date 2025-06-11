// library-backend/scripts/create_overdue_loan.js
const { loan, edition, user, sequelize } = require('../models');

const createOverdueLoanForTesting = async () => {
  console.log("Alustan testimiseks viivises laenutuse loomist...");
  try {
    // Leia suvaline kasutaja (kes ei ole admin) ja saadaolev raamat
    const testUser = await user.findOne({ where: { username: 'tavakasutaja' } });
    const availableEdition = await edition.findOne({ where: { availability: 'Available' } });

    if (!testUser || !availableEdition) {
      console.error("❌ Ei leidnud sobivat kasutajat või vaba raamatut. Käivita esmalt 'npm run db:seed'.");
      return;
    }

    // Tekitame kuupäevad, mis on minevikus
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Laenutati 30p tagasi

    const nineDaysAgo = new Date();
    nineDaysAgo.setDate(nineDaysAgo.getDate() - 9); // Tähtaeg oli 9p tagasi (21p laenutus)

    // Loo uus laenutus otse andmebaasi
    await loan.create({
      userid: testUser.userid,
      editionid: availableEdition.editionid,
      loandate: thirtyDaysAgo,
      duedate: nineDaysAgo,
      returndate: null
    });

    // Uuenda raamatu staatus
    await availableEdition.update({ availability: 'OnLoan' });

    console.log(`✅ Edukalt loodud viivises laenutus kasutajale '${testUser.username}' raamatule ID-ga ${availableEdition.editionid}.`);

  } catch (error) {
    console.error("❌ Viga viivises laenutuse loomisel:", error);
  } finally {
    await sequelize.close();
  }
};

createOverdueLoanForTesting();