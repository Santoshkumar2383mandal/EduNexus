const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String, // The name of the course
    },
    courseDescription: {
        type: String, // Brief description of the course
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the instructor (User model)
        required: true,
    },
    whatYouWillLearn: {
        type: String, // Key takeaways from the course
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section", // References the sections in the course
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview", // References user ratings and reviews
        }
    ],
    price: {
        type: Number, // Course price
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    tags:{
        type:[String],
        required:true,
    },
    thumbnail:{
        type:String,
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // References students enrolled in the course
            required: true,
        }
    ],
});

module.exports = mongoose.model("Course", courseSchema);
