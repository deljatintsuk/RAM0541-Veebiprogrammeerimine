const db = require('../models'); // Impordime uue seadistusega db objekti
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log("Alustan andmete sisestamist...");
        
        await db.role.bulkCreate([
            { rolename: 'Lugeja' }, { rolename: 'Töötaja' }, { rolename: 'Admin' }
        ], { ignoreDuplicates: true });
        console.log("Rollid loodud.");

        const userPasswordHash = bcrypt.hashSync('user123', 8);
        const adminPasswordHash = bcrypt.hashSync('admin123', 8);
        
        const lugejaRole = await db.role.findOne({where: {rolename: 'Lugeja'}});
        const adminRole = await db.role.findOne({where: {rolename: 'Admin'}});

        await db.user.bulkCreate([
            { username: 'tavakasutaja', email: 'lugeja@raamatukogu.ee', firstname: 'Test', lastname: 'Lugeja', passwordhash: userPasswordHash, roleid: lugejaRole.roleid },
            { username: 'admin', email: 'admin@raamatukogu.ee', firstname: 'Admin', lastname: 'Kasutaja', passwordhash: adminPasswordHash, roleid: adminRole.roleid }
        ], { ignoreDuplicates: true });
        console.log("Kasutajad loodud.");

        const authors = await db.author.bulkCreate([
            { name: 'Leo Tolstoy' }, { name: 'Mark Twain' }, { name: 'J.K. Rowling' }
        ], { ignoreDuplicates: true });
        console.log("Autorid loodud.");

        const subjects = await db.subject.bulkCreate([
            { subjectname: 'historical novel' }, { subjectname: 'adventure' }, { subjectname: 'fantasy' }
        ], { ignoreDuplicates: true });
        console.log("Teemad loodud.");

        const works = await db.work.bulkCreate([
            { title: 'War and Peace' }, { title: 'The Adventures of Tom Sawyer' }, { title: 'Harry Potter and the Sorcerer\'s Stone' }
        ], { ignoreDuplicates: true });
        console.log("Teosed loodud.");
        
        const work1 = await db.work.findOne({where: {title: 'War and Peace'}});
        const author1 = await db.author.findOne({where: {name: 'Leo Tolstoy'}});
        const subject1 = await db.subject.findOne({where: {subjectname: 'historical novel'}});
        
        if(work1 && author1) await work1.addAuthors([author1]); // See peaks nüüd töötama
        if(work1 && subject1) await work1.addSubjects([subject1]); // See peaks nüüd töötama

        console.log("\n✅ Andmete sisestamine on edukalt lõpetatud!");
    } catch (error) {
        console.error("❌ Viga andmete sisestamisel:", error);
    } finally {
        await db.sequelize.close();
        console.log("Andmebaasi ühendus on suletud.");
    }
};

seedDatabase();