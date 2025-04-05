const SubSection = require("../models/SubSection"); // Import SubSection model
const Section = require("../models/Section"); // Import Section model
const { uploadImageToCloudinary } = require("../utils/imageUploader"); // Import Cloudinary upload utility
require("dotenv").config(); // Load environment variables

// Function to create a new SubSection
exports.createSubSection = async (req, res) => {
    try {
        // Extract required fields from request body
        const { sectionId, title, timeDuration, description } = req.body;

        // Extract video file from request
        const video = req.files.videoFile;

        // Validate input fields
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Upload video to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // Create a new SubSection entry in the database
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Update the Section model by adding the new SubSection's ObjectId
        const updateSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            { new: true }
        ).populate("subSection"); // Populate subSections for response

        return res.status(200).json({
            success: true,
            message: "SubSection created successfully",
            data: updateSection,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message,
        });
    }
}

// Function to update an existing SubSection
exports.updateSubSection = async (req, res) => {
    try {
        // Extract data from request body
        const { sectionId, subSectionId, title, description } = req.body;

        // Find the SubSection in the database
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Update title if provided
        if (title !== undefined) {
            subSection.title = title;
        }

        // Update description if provided
        if (description !== undefined) {
            subSection.description = description;
        }

        // Update video if a new one is provided
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        // Save updated SubSection
        await subSection.save();

        // Fetch updated Section with populated SubSections
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        console.log("Updated Section: ", updatedSection);

        return res.json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedSection,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the SubSection",
        });
    }
}

// Function to delete a SubSection
exports.deleteSubSection = async (req, res) => {
    try {
        // Extract SubSection and Section IDs from request body
        const { subSectionId, sectionId } = req.body;

        // Remove SubSection reference from the Section model
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        );

        // Delete the SubSection from the database
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Fetch updated Section with populated SubSections
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        });
    }
}
