const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who gave the rating
        required: true,
    },
    rating: {
        type: Number, // Numerical rating
        required: true,
    },
    review: {
        type: String, // Review text
        required: true,
    }
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
