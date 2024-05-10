# Enhanced Auth API Reference

## Introduction
This document serves as a reference guide for the Enhanced Auth API, a robust authentication and authorization system designed to provide secure access control for web applications.

## Installation and Setup
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Create a `.env` file based on the provided `.env.example` file and configure environment variables.
5. Run the application using `npm start`.

## Usage
1. Register a user account using the `/register` endpoint.
2. Log in with your registered credentials using the `/login` endpoint.
3. Utilize the provided endpoints to manage user profiles and authentication:
   - `/profile` GET: Retrieve user profile information.
   - `/profile` PUT: Update user profile information.
   - `/profile/status` PUT: Activate or deactivate user profile.
   - `/profiles` GET: Retrieve a list of user profiles based on user role.
   - `/profiles/all` GET: Retrieve a list of all user profiles (admin only).
   - `/auth/google` GET: Initiate Google OAuth 2.0 authentication.
   - `/auth/google/callback` GET: Handle Google OAuth 2.0 authentication callback.

## Project Overview
- **registerUser.js**: Handles user registration and token generation.
- **loginUser.js**: Manages user authentication and token issuance.
- **profile.js**: Contains CRUD operations for user profiles (getProfileList, updateProfile, updateProfileStatus, getAllProfileList).
- **Routes/Route.js**: Defines routes for pre-auth and post-auth endpoints.
- **middleware/verifyToken.js**: Middleware function to verify JWT tokens.
- **Models/User.js**: Schema and model for User data.
- **env.config.js**: Configuration file for environment variables.
- **index.js**: Main entry point for the application.

## Documentation
For detailed documentation, please refer to the [API Documentation](https://docs.google.com/document/d/1m1pCd1ZOTXjORR9HZHn7vAx2HrvXlATq9Bc2rwixmJQ/edit?usp=sharing).

## Postman Collection
Access the [Postman Collection](https://www.postman.com/descent-module-cosmologist-51137549/workspace/enhanched-authentication-api/request/21309452-48957a52-752e-4dc0-b59f-72bd5aa24410) for testing the API endpoints.

## Deployment
This application is hosted on [AuthPlus Deployment](https://enhanced-authentication-api-0mtk.onrender.com/). Please note that due to inactivity of the URL, the first-time access may experience a delay of 50-60 seconds.

---
This documentation provides an overview of the Enhanced Auth API, including installation instructions, usage guidelines, project overview, and deployment details. For any further inquiries or assistance, please refer to the provided documentation or reach out to the project maintainers.
