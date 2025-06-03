const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

require('./swagger-autogen.js')

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};