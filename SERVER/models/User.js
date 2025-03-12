const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, // First name of the user
    },
    lastName: {
        type: String,
        required: true,
        trim: true, // Last name of the user
    },
    email: {
        type: String,
        required: true,
        trim: true, // User's email (unique identifier)
    },
    password: {
        type: String,
        required: true, // Hashed password
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"], // User roles
        required: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile", // Links to Profile schema for more details
        required: true,
    },
    Courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course", // List of courses created by the instructor
        }
    ],
    image: {
        type: String,
        required: true, // Profile image URL
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress", // Tracks user progress in courses
        }
    ],
});

module.exports = mongoose.model("User", userSchema);
