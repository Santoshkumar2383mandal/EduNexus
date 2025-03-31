const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createCourse } = require("../controllers/Course");
const router = require("../routes/User");
const { createSection, updateSection } = require("../controllers/Section");
require("dotenv").config();

// Middleware for Authorization
exports.autho = async (req, res, next) => {
    try {
        // Extract token from cookies, request body, or Authorization header
        const token = req.cookies?.token
            || req.body.token
            || req.header("Authorization")?.replace("Bearer ","").trim();

        // If token is missing, return an error response
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is missing",
            });
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            // Attach the decoded user information to the request object
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }

        // Proceed to the next middleware
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating token',
        });
    }
};

// Middleware to check if the user is a Student
exports.isStudent = async (req, res, next) => {
    try {
        // Check the account type from the decoded token
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Students only',
            });
        }
        // Proceed to the next middleware
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again',
        });
    }
};

// Middleware to check if the user is an Instructor
exports.isInstructor = async (req, res, next) => {
    try {
        // Check the account type from the decoded token
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Instructors only',
            });
        }
        // Proceed to the next middleware
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again',
        });
    }
};

// Middleware to check if the user is an Admin
exports.isAdmin = async (req, res, next) => {
    try {
        // Check the account type from the decoded token
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admins only',
            });
        }
        // Proceed to the next middleware
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again',
        });
    }
};
