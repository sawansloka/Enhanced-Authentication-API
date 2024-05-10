const swaggerJsdoc = require('swagger-jsdoc');
const config = require("./env.config");

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Your API Title',
        version: '1.0.0',
        description: 'Description of your API',
    },
    servers: [
        {
            url: 'http://localhost:' + `${config.PORT}`,
            description: 'Development server',
        },
    ],
};

// Options for the swagger-jsdoc
const options = {
    swaggerDefinition,
    // Path to the API docs
    apis: ['./Routes/Route.js', './Controller/login.js', './Controller/profile.js', './Controller/register.js', './Controller/routes.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

