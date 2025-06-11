const axios = require('axios');
const { work, author, subject, edition, sequelize } = require('../models');

const importFromOpenLibrary = async () => {
    const subjectsToImport = [
        "fantasy", "science_fiction", "mystery", "thriller", 
        "romance", "historical_fiction", "biography", "horror",
        "adventure", "classics", "crime", "dystopian"
    ];
    const booksPerSubject = 15;
    
    console.log(`Alustan andmete importimist ${subjectsToImport.length} teemast, kuni ${booksPerSubject} raamatut teema kohta.`);

    try {
        let totalBooksProcessed = 0;
        for (const subjectName of subjectsToImport) {
            console.log(`\n--- Töötlen teemat: ${subjectName} ---`);

            const [subjectRecord] = await subject.findOrCreate({
                where: { subjectname: subjectName.replace(/_/g, ' ') },
            });

            const response = await axios.get(
                `https://openlibrary.org/subjects/${subjectName}.json?limit=${booksPerSubject}`
            );
            const worksFromAPI = response.data.works;
            
            console.log(`Leitud ${worksFromAPI.length} teost API-st.`);

            for (const workData of worksFromAPI) {
                totalBooksProcessed++;
                const [workRecord, workCreated] = await work.findOrCreate({
                    where: { title: workData.title }
                });

                const logPrefix = workCreated ? `  [UUS TEOS]` : `  [OLEMASolev]`;
                console.log(`${logPrefix} ${workRecord.title} (kokku töödeldud: ${totalBooksProcessed})`);

                // Seoste lisamine
                await workRecord.addSubjects([subjectRecord]);
                
                if (workData.authors) {
                    for (const authorData of workData.authors) {
                        const [authorRecord] = await author.findOrCreate({
                            where: { name: authorData.name },
                        });
                        await workRecord.addAuthors([authorRecord]);
                    }
                }
                
                // Väljaande info hankimine
                if (workData.cover_edition_key) {
                    try {
                        const edRes = await axios.get(`https://openlibrary.org/books/${workData.cover_edition_key}.json`);
                        const edDet = edRes.data;
                        const isbn = edDet.isbn_13?.[0] || edDet.isbn_10?.[0];

                        if (isbn) {
                            const [, edCreated] = await edition.findOrCreate({
                                where: { isbn13: isbn },
                                defaults: {
                                    workid: workRecord.workid,
                                    publisher: edDet.publishers?.[0] || 'N/A',
                                    publicationdate: edDet.publish_date ? new Date(edDet.publish_date.replace(/,/g, '')) : null,
                                    availability: 'Available'
                                }
                            });
                            if (edCreated) {
                                console.log(`    -> Loodud uus väljaanne | ISBN: ${isbn}`);
                            }
                        }
                    } catch (e) {
                        // Väljaande vigade puhul ei katkesta protsessi, jätkame järgmisega
                    }
                }
            }
        }
        console.log(`\n✅ Andmete importimine on edukalt lõpetatud! Kokku töödeldi ${totalBooksProcessed} teost.`);
    } catch (error) {
        console.error("❌ Üldine viga andmete importimisel:", error.message);
    } finally {
        await sequelize.close();
        console.log("Andmebaasi ühendus suletud.")
    }
};

importFromOpenLibrary();