// Import the Tags model
const Tags = require("../models/Tags");

// =============================================
// Handler function to create a new tag
// =============================================
exports.createTag = async (req, res) => {
    try {
        // Extract tag name and description from request body
        const { name, description } = req.body;

        // Validate input: Ensure both name and description are provided
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Create a new tag entry in the database
        const tagDetails = await Tags.create({
            name: name,
            description: description,
        });

        // Log the created tag details (for debugging)
        console.log(tagDetails);

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
        });

    } catch (error) {
        // Handle any server errors
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =============================================
// Handler function to fetch all tags
// =============================================
exports.showAlltags = async (req, res) => {
    try {
        // Fetch all tags from the database, selecting only name and description
        const allTags = await Tags.find({}, { name: true, description: true });

        // Send success response with the retrieved tags
        res.status(200).json({
            success: true,
            message: 'All tags returned successfully',
            allTags,
        });

    } catch (error) {
        // Handle any server errors
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
