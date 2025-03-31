// Import the Tags model
const Category = require("../models/Category");

// =============================================
// Handler function to create a new tag
// =============================================
exports.createCategory = async (req, res) => {
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

        // Create a new category entry in the database
        const CategorysDetails = await Category.create({
            name: name,
            description: description,
        });

        // Log the created tag details (for debugging)
        console.log(CategorysDetails);

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
exports.showAllCategories = async (req, res) => {
    try {
        // Fetch all tags from the database, selecting only name and description
        const allCategorys = await Category.find({}, { name: true, description: true });

        // Send success response with the retrieved tags
        res.status(200).json({
            success: true,
            message: 'All tags returned successfully',
            allCategorys,
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
// Handler function to show Category page Details
// =============================================
exports.categoryPageDetails = async (req, res) => { 
    try {
        // Extract categoryId from the request body
        const { categoryId } = req.body;
        
        // Fetch the specific category by its ID and populate its associated courses
        const selectCategory = await Category.findById(categoryId).populate("courses").exec();

        // If the category is not found, return a 404 response
        if (!selectCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Fetch all categories except the one specified by categoryId
        // Populate their associated courses
        const differentCategory = await Category.find(
            { _id: { $ne: categoryId } }
        ).populate("courses").exec();
        
        // Placeholder for fetching top-selling courses
        // TODO: Write a query to fetch top-selling courses based on your business logic

        // Send a success response with the fetched data
        return res.status(200).json({
            success: true,
            message: "Category details fetched successfully",
            data: {
                selectCategory,      // The specific category and its courses
                differentCategory,   // Other categories and their courses
            },
        });
        
    } catch (error) {  
        // Handle any server-side errors and return a 500 response
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};