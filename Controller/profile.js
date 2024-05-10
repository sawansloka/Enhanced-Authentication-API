const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const config = require('../env.config');

/**
 * Retrieves a list of profiles based on user role.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
async function getProfileList(req, res) {
    try {
        const { isAdmin } = req.user;

        const params = {
            isAdmin: false,
            isActive: true
        };
        if (!isAdmin) params.isPublic = true;

        const profiles = await User.find(params);
        const transformedProfiles = profiles.map(transformProfile);

        res.json(transformedProfiles);
    } catch (error) {
        console.error('Error in getProfileList:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Updates a user profile.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
async function updateProfile(req, res) {
    try {
        const { userId } = req.user;
        const { imageUrl, name, bio, phone, email, password, isPublic } = req.body;

        // Validate input fields
        if (!validateFields(name, phone, email, password)) {
            return res.status(400).json({ message: 'Invalid input format' });
        }

        // Hash the password if provided
        let hashedPassword = undefined;
        if (password) {
            const saltRounds = parseInt(config.SALT_KEY);
            const salt = await bcrypt.genSalt(saltRounds);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Update user profile
        const updatedProfile = await User.findByIdAndUpdate(userId, { imageUrl, name, bio, phone, email, password: hashedPassword, isPublic }, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Activates or deactivates a user profile.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
async function updateProfileStatus(req, res) {
    try {
        const { userId, isAdmin } = req.user;
        const { id, isActive } = req.query;
        let flag = false;

        if ((userId.toString() !== id.toString()) && (!isAdmin)) {
            return res.status(403).json({ message: 'You do not have permission to access' });
        }

        if (isActive === 'true') flag = true;

        const updatedProfile = await User.findByIdAndUpdate(id, { isActive: flag }, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({ message: `User ${flag ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error in updateProfileStatus:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Retrieves a list of all profiles (admin only).
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
async function getAllProfileList(req, res) {
    try {
        const { isAdmin } = req.user;

        if (!isAdmin) return res.status(403).json({ message: 'You do not have permission to access' });

        const profiles = await User.find({}).select('_id imageUrl name bio phone email isAdmin isPublic isActive date');

        res.json(profiles);
    } catch (error) {
        console.error('Error in getAllProfileList:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Transforms user profile data.
 * @param {Object} user - The user object.
 * @returns {Object} - Transformed profile data.
 */
function transformProfile(user) {
    const { _id, imageUrl, name, bio, phone, email } = user;
    return { _id, imageUrl, name, bio, phone, email };
}

/**
 * Validates input fields.
 * @param {string} name - The name field.
 * @param {string} phone - The phone field.
 * @param {string} email - The email field.
 * @param {string} password - The password field.
 * @returns {boolean} - Whether the fields are valid or not.
 */
function validateFields(name, phone, email, password) {
    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]*$/;

    if (!name || !nameRegex.test(name)) return false;
    if (phone && (!Number.isInteger(phone) || phone <= 0)) return false;
    if (email && !emailRegex.test(email)) return false;
    if (password && !passwordRegex.test(password)) return false;

    return true;
}

module.exports = { getProfileList, updateProfile, updateProfileStatus, getAllProfileList };
