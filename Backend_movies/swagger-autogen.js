const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
//const endpointsFiles = ['./routes/*.js']; // Reading every route in routes folder, doesn't work with Router
const endpointsFiles = ['./index.js']; // Reading routes from index.js links
const doc = {
    info: {
        title: 'Movies API',
        description: 'Site for browsing API',
    },
    host: 'localhost:8080', 
    schemes: ['http'], 
};

swaggerAutogen(outputFile, endpointsFiles, doc);