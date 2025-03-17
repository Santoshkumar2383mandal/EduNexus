// Import required models and utilities
const Course = require("../models/Course"); 
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Handler function to create a new course
exports.createCourse = async (req, res) => {
    try {
        // Extract course details from request body
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;
        const thumbnail = req.files.thumbnailImage; // Get thumbnail image from request files

        // Validate input fields
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Validate instructor details
        const userId = req.body.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor details:", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: 'Instructor details not found',
            });
        }

        // Validate tag details
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: 'Tag details not found',
            });
        }

        // Upload thumbnail image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create a new course entry in the database
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // Add the new course to the instructor's user profile
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            { $push: { courses: newCourse._id } },
            { new: true },
        );

        // Send a success response with the created course data
        return res.status(200).json({
            success: true,
            message: 'Course created successfully',
            data: newCourse,
        });
    } catch (error) {
        // Handle errors during course creation
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};

// Handler function to fetch all courses
exports.showAllCourses = async (req, res) => {
    try {
        // Fetch all courses with selected fields and populate instructor details
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor").exec();

        // Send a success response with course data
        return res.status(200).json({
            success: true,
            message: 'Data for all courses fetched successfully',
            data: allCourses,
        });

    } catch (error) {
        // Handle errors while fetching course data
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot fetch course data',
            error: error.message,
        });
    }
};
