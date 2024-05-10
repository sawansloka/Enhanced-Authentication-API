const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const config = require('../env.config');

/**
* Registers a new user.
*/
async function registerUser(req, res) {
    register(req, res);
}

/**
 * Registers a new admin user.
 */
async function registerAdminUser(req, res) {
    register(req, res, true);
}

/**
 * Registers a new user or admin user based on the isAdmin flag.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {boolean} isAdmin - Whether the user to be registered is an admin or not.
 */
async function register(req, res, isAdmin = false) {
    const { name, email, password, confirmPassword, imageUrl, bio, phone, isPublic } = req.body;

    try {
        // Validate user input
        validateInput(name, email, password, confirmPassword);

        // Check if user already exists
        await checkUserExists(email);

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create a new user instance
        const user = createUserInstance(name, email, hashedPassword, isAdmin, imageUrl, bio, phone, isPublic);

        // Save the new user to the database
        await user.save();

        // Generate and save JWT token
        const token = await generateAndSaveToken(user);

        // Send the token in the response
        res.json({ token });
    } catch (error) {
        handleError(error, res);
    }
}

/**
 * Validates user input fields.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @param {string} confirmPassword - The confirmed password of the user.
 */
function validateInput(name, email, password, confirmPassword) {
    if (!name || !email || !password || !confirmPassword) {
        throw new Error('Provide all fields');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }

    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
        throw new Error('Invalid name format');
    }

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]*$/;
    if (!passwordRegex.test(password)) {
        throw new Error('Password must contain only letters, numbers, and the following special characters: !@#$%^&*');
    }

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
}

/**
 * Checks if a user with the provided email already exists in the database.
 * 
 * @param {string} email - The email address of the user.
 */
async function checkUserExists(email) {
    const user = await User.findOne({ email });
    if (user) {
        throw new Error('User already exists');
    }
}

/**
 * Hashes the provided password using bcrypt.
 * 
 * @param {string} password - The password to be hashed.
 * @returns {string} - The hashed password.
 */
async function hashPassword(password) {
    const saltRounds = parseInt(config.SALT_KEY);
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
}

/**
 * Creates a new user instance.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} hashedPassword - The hashed password of the user.
 * @param {boolean} isAdmin - Whether the user to be registered is an admin or not.
 * @param {string} imageUrl - The URL of the user's profile image.
 * @param {string} bio - The bio of the user.
 * @param {string} phone - The phone number of the user.
 * @param {boolean} isPublic - Whether the user's profile is public or not.
 * @returns {Object} - The user instance.
 */
function createUserInstance(name, email, hashedPassword, isAdmin, imageUrl, bio, phone, isPublic) {
    return new User({
        name,
        email,
        password: hashedPassword,
        isAdmin,
        imageUrl,
        bio,
        phone,
        isPublic
    });
}

/**
 * Generates and saves JWT token for the user.
 * 
 * @param {Object} user - The user object.
 * @returns {string} - The generated JWT token.
 */
async function generateAndSaveToken(user) {
    const payload = {
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '10m' });
    user.token = token;
    await user.save();
    return token;
}

/**
 * Handles errors that occur during user registration.
 * 
 * @param {Error} error - The error object.
 * @param {Object} res - The response object.
 */
function handleError(error, res) {
    if (error.code === 11000) {
        // Duplicate key error (e.g., email already exists)
        res.status(400).json({ message: 'Email already exists' });
    } else {
        console.error('Error saving user to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { registerUser, registerAdminUser };