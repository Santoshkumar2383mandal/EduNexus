const cloudinary = require("cloudinary");

// Function to upload an image to Cloudinary
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder }; // Set the folder in Cloudinary

    // Add optional height parameter if provided
    if (height) {
        options.height = height;
    }

    // Add optional quality parameter if provided
    if (quality) {
        options.quality = quality;
    }

    // Automatically determine the resource type (image, video, etc.)
    options.resource_type = "auto";

    // Upload the file to Cloudinary and return the response
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};
