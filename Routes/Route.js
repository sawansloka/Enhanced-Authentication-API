const { Router } = require('express');

function defineRoutes(app, preAuthRoutes, postAuthRoutes) {
    const router = Router();

    // Health check of server
    router.get('/healthcheck', (req, res) => {
        res.status(200).json({ message: "Server is up!!!" });
    });

    // Define pre-auth routes
    preAuthRoutes.forEach(route => {
        const { method, path, functionName } = route
        router[method.toLowerCase()](path, functionName);
    });

    // Token verification middleware
    const verifyToken = require("../Middleware/verifyToken");
    router.use(verifyToken);

    // Define post-auth routes
    postAuthRoutes.forEach(route => {
        const { method, path, functionName } = route;
        router[method.toLowerCase()](path, functionName);
    });

    // Add router to express app
    app.use(router);
}

module.exports = defineRoutes;