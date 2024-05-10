const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const config = require('../env.config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

/**
 * Handles user login.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        // Validate user input
        validateUserInput(email, password);

        // Find user by email in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If authentication is successful, generate a new JWT token with user ID payload
        const token = await generateAndSaveToken(user);

        // Send the new token in the response
        res.json({ token });

    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

/**
 * Validates user input fields.
 * 
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 */
function validateUserInput(email, password) {
    if (!email || !password) {
        throw new Error('Provide both email and password');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]*$/;
    if (!passwordRegex.test(password)) {
        throw new Error('Password must contain only letters, numbers, and the following special characters: !@#$%^&*');
    }
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

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.HOST}/auth/google/callback`
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            let userInfo = await User.find({ email: profile._json.email })
            let token;
            if (!userInfo || userInfo.length === 0) {
                // If user not found, create a new user
                const saltRounds = parseInt(config.SALT_KEY);
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedPassword = await bcrypt.hash(config.JWT_SECRET, salt);
                const newUser = new User({
                    email: profile._json.email,
                    password: hashedPassword,
                    imageUrl: profile._json.picture,
                    name: profile._json.name
                });
                userInfo = await newUser.save();
            }
            token = await generateAndSaveToken(userInfo[0]);

            // Callback with user data and token
            return cb(null, { user: userInfo, token: token });
        } catch (err) {
            console.error('Error in Google authentication:', err);
            return cb(err);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

/**
 * Initiates Google authentication.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function googleLogin(req, res) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
}

/**
 * Handles Google authentication callback.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function googleCallBack(req, res) {
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, async function (err, data) {
        if (err) {
            console.error('Error in Google authentication callback:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }
        // Successful authentication, send back user data and JWT token
        res.json({ token: req.user.token });
    });
}

module.exports = { loginUser, googleLogin, googleCallBack };
