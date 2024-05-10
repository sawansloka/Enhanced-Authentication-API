const { registerUser, registerAdminUser } = require("./register");
const { loginUser, googleLogin, googleCallBack } = require("./login");
const { getProfileList, updateProfile, updateProfileStatus, getAllProfileList } = require("./profile");
const logoutUser = require('./logout');

const routes = [
    {
        path: "/users/register",
        method: "POST",
        name: "User Registration",
        describe: "Register a new user",
        functionName: registerUser
    },
    {
        path: "/admin/register",
        method: "POST",
        name: "Admin User Registration",
        describe: "Register a new admin user",
        functionName: registerAdminUser
    },
    {
        path: "/users/login",
        method: "POST",
        name: "User Login",
        describe: "Authenticate user login",
        functionName: loginUser
    },
    {
        path: "/auth/google",
        method: "GET",
        name: "Login Via Google",
        describe: "Login Via Google",
        functionName: googleLogin
    },
    {
        path: "/auth/google/callback",
        method: "GET",
        name: "Google Callback",
        describe: "Callback API for google",
        functionName: googleCallBack
    },
    {
        path: "/users/logout",
        method: "POST",
        name: "User Logout",
        describe: "Authenticate user logout",
        functionName: logoutUser
    },
    {
        path: "/profiles",
        method: "GET",
        name: "Get Profile List",
        describe: "Get Profiles List",
        functionName: getProfileList
    },
    {
        path: "/profiles/update",
        method: "PUT",
        name: "Update profile",
        describe: "Update an existing profile",
        functionName: updateProfile
    },
    {
        path: "/profiles/update-status",
        method: "PUT",
        name: "Update Profile Status",
        describe: "Set profile active or inactive",
        functionName: updateProfileStatus
    },
    {
        path: "/profiles/all",
        method: "GET",
        name: "Get All Profiles",
        describe: "Get all Profiles",
        functionName: getAllProfileList
    }
];

module.exports = routes;
