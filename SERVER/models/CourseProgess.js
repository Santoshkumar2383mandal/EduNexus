const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // Reference to the associated course
    },
    completeVideos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection", // Tracks completed video subsections
    }
});

module.exports = mongoose.model("CourseProgress", courseProgressSchema);
