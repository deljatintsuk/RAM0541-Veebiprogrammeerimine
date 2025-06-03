const swaggerAutogen = require('swagger-autogen')();
const path = require('path');
// Siin peame samuti .env faili laadima, et porti ja hosti õigesti määrata
require('dotenv').config({ path: path.resolve(__dirname, '.env') });


const outputFile = './swagger_output.json'; // Väljundfaili nimi
// Määrame failid, kust marsruute lugeda
const endpointsFiles = [
    './routes/authRoutes.js',
    './routes/actorRoutes.js',
    './routes/categoryRoutes.js',
    './routes/filmRoutes.js',
    './routes/languageRoutes.js',
    './routes/filmActorRoutes.js',
    './routes/filmCategoryRoutes.js',
    './routes/roleRoutes.js',
    './routes/userRoutes.js',
    // Lisa siia kindlasti kõik oma marsruutide failid
];

const doc = {
    info: {
        title: 'Minu Filmi API',
        description: 'API dokumentatsioon (Genereeritud swagger-autogeniga)',
    },
    // HOST peab vastama sinu rakenduse aadressile ja pordile!
    host: `localhost:${process.env.PORT || 3000}`, // Kasuta siin sama porti mis app.js ja .env-s
    schemes: ['http'],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        // Defineeri siin skeemad, mida saad marsruutide kommentaarides kasutada
        schemas: {
           Actor: {
             type: 'object',
             properties: {
               actor_id: { type: 'integer' },
               first_name: { type: 'string' },
               last_name: { type: 'string' },
               last_update: { type: 'string', format: 'date-time' },
             },
           },
           Category: {
             type: 'object',
             properties: {
               category_id: { type: 'integer' },
               name: { type: 'string' },
               last_update: { type: 'string', format: 'date-time' },
             },
           },
           Film: {
             type: 'object',
             properties: {
               film_id: { type: 'integer' },
               title: { type: 'string' },
               description: { type: 'text' },
               release_year: { type: 'integer' },
               language_id: { type: 'integer' },
               original_language_id: { type: 'integer' },
               rental_duration: { type: 'integer' },
               rental_rate: { type: 'number', format: 'float' },
               length: { type: 'integer' },
               replacement_cost: { type: 'number', format: 'float' },
               rating: { type: 'string', enum: ["G","PG","PG-13","R","NC-17"] },
               last_update: { type: 'string', format: 'date-time' },
               special_features: { type: 'array', items: { type: 'string' } },
             },
           },
           Language: {
             type: 'object',
             properties: {
               language_id: { type: 'integer' },
               name: { type: 'string' },
               last_update: { type: 'string', format: 'date-time' },
             },
           },
           Role: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
              },
           },
           User: {
             type: 'object',
             properties: {
               id: { type: 'integer' },
               email: { type: 'string' },
               username: { type: 'string' },
               role_id: { type: 'integer' },
               role: { $ref: '#/components/schemas/Role' }
             },
           },
            FilmActor: {
               type: 'object',
               properties: {
                   actor_id: { type: 'integer' },
                   film_id: { type: 'integer' },
                   last_update: { type: 'string', format: 'date-time' },
                   actor: { $ref: '#/components/schemas/Actor' },
                   film: { $ref: '#/components/schemas/Film' },
               },
           },
           FilmCategory: {
               type: 'object',
               properties: {
                   film_id: { type: 'integer' },
                   category_id: { type: 'integer' },
                   last_update: { type: 'string', format: 'date-time' },
                    film: { $ref: '#/components/schemas/Film' },
                    category: { $ref: '#/components/schemas/Category' },
               },
           },
        }
    },
     security: [
         {
             bearerAuth: []
         }
     ]
};

// Käivita genereerimine
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger dokumentatsioon genereeritud faili:', outputFile);
});