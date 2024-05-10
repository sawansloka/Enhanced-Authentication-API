const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./env.config");
const defineRoutes = require("./Routes/Route");
const { registerUser, registerAdminUser } = require("./Controller/register");
const { loginUser, googleLogin, googleCallBack } = require("./Controller/login");
const routes = require("./Controller/routes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerSpec');
const session = require('express-session');
const passport = require('passport');


const app = express();

// Middleware
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: config.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(error => console.error('MongoDB connection error:', error));


// Define routes
const preAuthRoutes = routes.filter(route => [registerUser, registerAdminUser, loginUser, googleLogin, googleCallBack].includes(route.functionName));
const postAuthRoutes = routes.filter(route => ![registerUser, registerAdminUser, loginUser, googleLogin, googleCallBack].includes(route.functionName));

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

defineRoutes(app, preAuthRoutes, postAuthRoutes);

// Start the server
const port = config.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});