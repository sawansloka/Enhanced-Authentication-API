const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isExpired: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('User', userSchema);
