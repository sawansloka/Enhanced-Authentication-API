require('dotenv').config()
const config = {
    DB_URI: process.env.DB_URI || "mongodb://localhost:27017/local-test-service?retryWrites=true&w=majority&appName=bookManagement",
    PORT: process.env.PORT || 3002,
    JWT_SECRET: process.env.JWT_SECRET || "007sawan",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "sawan",
    SESSION_KEY: process.env.SESSION_KEY || "sawan",
    SALT_KEY: process.env.SALT_KEY || "20",
    HOST: process.HOST || "http://localhost:4000"
}

module.exports = config;
