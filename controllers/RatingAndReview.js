const ratingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/Course");
const User = require("../models/User");

// Handler function to create a new rating and review
exports.createRating = async (req, res) => {
    try {
        // Extract user ID, rating, review, and course ID from request body
        const userId = req.body.id;
        const { rating, review, courseId } = req.body;

        // Check if the user is enrolled in the course
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        // Check if the user has already submitted a review for this course
        const alreadyReviewed = await ratingAndReviews.findOne({
            userId: userId,
            courseId: courseId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course",
            });
        }

        // Create a new rating and review entry
        const newRating = new ratingAndReviews({
            userId: userId,
            courseId: courseId,
            rating: rating,
            review: review,
        });

        // Save the new rating and review in the database
        await newRating.save();

        // Update the course document to include the new rating and review ID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            { $push: { ratingAndReviews: newRating._id } },
            { new: true }
        );

        console.log(updatedCourseDetails);
        return res.status(200).json({
            success: true,
            message: "Rating and review added successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Handler function to fetch the average rating for a course
exports.getAverageRating = async (req, res) => {
    try {
        // Extract course ID from request body
        const courseId = req.body.courseId;

        // Calculate the average rating of the course
        const result = await ratingAndReviews.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }, // Calculate the average
                },
            }
        ]);

        // Return the average rating if available
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // If no ratings are found, return a default message
        return res.status(200).json({
            success: true,
            message: "No rating found",
            averageRating: 0,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Handler function to fetch all ratings and reviews
exports.getAllRating = async (req, res) => {
    try {
        // Fetch all reviews, sorted by rating in descending order
        const allReviews = await ratingAndReviews.find({})
            .sort({ rating: "desc" }) // Sort reviews from highest to lowest rating
            .populate({
                path: "user",
                select: "firstName lastName email image", // Fetch user details
            })
            .populate({
                path: "course",
                select: "courseName", // Fetch course name
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
