const jwt = require('jsonwebtoken');
const config = require('../env.config');
const User = require('../Models/User');

// Logout user
async function logoutUser(req, res) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        try {
            // Set isExpired to null in the user document
            const userId = req.user.userId;
            await User.findByIdAndUpdate(userId, { isExpired: true });

            // Log out the user
            req.logout(function (err) {
                if (err) {
                    // If an error occurs during logout, send an error response
                    console.error('Error during logout:', err);
                    res.status(500).json({ message: 'Internal server error' });
                } else {
                    // If logout is successful, send a success response
                    res.clearCookie(req.headers['authorization']);
                    res.json({ message: 'Logout successful' });
                }
            });
        } catch (error) {
            console.error('Error updating user token:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // If the user is not authenticated, send an error response
        res.status(401).json({ message: 'User not authenticated' });
    }
}

module.exports = logoutUser;
