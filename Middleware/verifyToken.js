const jwt = require('jsonwebtoken');
const config = require('../env.config');
const User = require('../Models/User');

// Middleware function to verify JWT token
async function verifyToken(req, res, next) {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader)
        return res.status(401).json({ auth: false, message: 'Provide token' });

    // Split the token string to extract the actual token value
    const token = tokenHeader.split(' ')[1];

    jwt.verify(token, config.JWT_SECRET, async function (err, decoded) {
        // Handle error if token verification fails
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ auth: false, message: 'Token expired' });
            } else {
                return res.status(403).json({ auth: false, message: 'ACCESS DENIED' });
            }
        }

        try {
            // Check if token matches the one stored in the user document
            const user = await User.find({ email: decoded.email });

            if (!user[0] || user[0].token !== token) {
                return res.status(401).json({ auth: false, message: 'Login again to get a valid token' });
            }

            // If token verification is successful, set user in request object and call next middleware
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                isAdmin: decoded.isAdmin
            };
            next();
        } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(500).json({ auth: false, message: 'Internal server error' });
        }
    });
}

module.exports = verifyToken;
