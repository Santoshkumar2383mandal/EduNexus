const mongoose = require("mongoose");

// Define the Category schema to store category-related data
const categorySchema = new mongoose.Schema({
	name: {
		type: String, // Name of the category
		required: true, // Ensures that name is always provided
	},
	description: { 
		type: String, // Optional field to store category description
	},
	courses: [
		{
			type: mongoose.Schema.Types.ObjectId, // References Course model
			ref: "Course", // Establishes a relationship with the "Course" collection
		},
	],
});

// Export the Category model for use in other parts of the application
module.exports = mongoose.model("Category", categorySchema);
