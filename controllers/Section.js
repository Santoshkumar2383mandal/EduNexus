const Section = require("../models/Section"); // Importing the Section model
const Course = require("../models/Course"); // Importing the Course model

// Function to create a new section
exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body; // Extracting section name and course ID from request

        // Validate request data
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }

        // Create a new section in the database
        const newSection = await Section.create({ sectionName});

        // Update the course by adding the new section ID to its content
        const updateCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: { courseContent: newSection._id }, // Add the section ID to courseContent array
            },
            { new: true } // Return the updated document
        )
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        })
        .exec();

        // Return response
        res.status(200).json({
            success: true,
            message: 'Section created successfully',
            updateCourseDetails, 
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create Section, Please try again',
            error: error.message,
        });
    }
}

// Function to update an existing section
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body; // Extract section name and ID

        // Validate request data
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing properties',
            });
        }

        // Update section name
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }, // Return the updated document
        );

        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to update Section, Please try again',
            error: error.message,
        });
    }
}

// Function to delete a section
exports.deleteSection = async (req, res) => {
    try {
        // Get section ID from request parameters
        const { sectionId,courseId } = req.body;
        //delete section from course content
        await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: { courseContent: sectionId },
            },
            { new: true }
        );
        // Delete the section from the database
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to delete Section, Please try again',
            error: error.message,
        });
    }
}
