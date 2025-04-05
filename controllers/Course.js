// Import required models and utilities
const { json } = require("express");
const Course = require("../models/Course"); 
const Tag = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Handler function to create a new course
exports.createCourse = async (req, res) => {
    try {
        // Extract course details from request body
        const { courseName, courseDescription, whatYouWillLearn, price, tags:_tags,category} = req.body;
        const thumbnail = req.files.thumbnailImage; // Get thumbnail image from request files
        

        //convert tags to array
        const tags = JSON.parse(_tags);
        console.log("tag",tags);
        // Validate input fields
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Validate instructor details
        const userId = req.user.id; // Extract user ID from token
        console.log("Received User ID:", userId);
        const instructorDetails = await User.findById(userId);
        console.log("Instructor details:", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: 'Instructor details not found',
            });
        }

        // Validate tag details
        const categoryDetails = await Tag.findById(category);
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: 'category details not found',
            });
        }

        // Upload thumbnail image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log("thumbnailImage", thumbnailImage);
        // Create a new course entry in the database
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tags,
            category: categoryDetails._id,
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
exports.getAllCourses = async (req, res) => {
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

//Handler function to fetch couse All Details
exports.getCourseDetails = async (req, res) => {
    try{
        const {courseId} = req.body;
        //find course details
        const courseDetails = await Course.findById(
            { _id: courseId })
            .populate(
                {
                    path:"instructor",
                    populate:{
                        path:"additionalDetails",
                    },
                }
            )
            .populate("category")
            // .populate("ratingAndReviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection",
                },
            })
        .exec();

        if(!courseDetails){
            return res.status(404).json({
                status:false,
                message: "Course not found with the provided ID",
            });
        }
        //send success response with course details
        return res.status(200).json({
            status:true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            status:false, 
            message: "Internal server error"
        });
    }
};

//Handler function to edit course details
exports.editCourse = async (req, res) => {
    try{
        const {courseId} = req.body;
        const update = req.body;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                status:false,
                message: "Course not found with the provided ID",
            });
        }

        //if thumbnail image is provided, update it 
        if(req.files){
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
            course.thumbnail = thumbnailImage.secure_url;
        }

        //update only the fields which are provided in the request body
        for(let key in update){
            if(update.hasOwnProperty(key)){
                if(key=="tag" || key == "instructor"){
                    course[key] = JSON.parse(update[key]);
                }else{
                    course[key] = update[key];
                }
            }
        }
        await course.save();

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        }).exec();

        res.json({
            status:true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            status:false,
            message: "Internal server error",
            error: error.message,
        });
    }
};