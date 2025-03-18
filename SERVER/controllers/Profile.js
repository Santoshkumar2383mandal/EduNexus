const Profile = require("../models/Profile"); // Import Profile model
const User = require("../models/User"); // Import User model

// Function to update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Extract profile update fields from request body
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        // Get user ID from authenticated request
        const id = req.user.id;

        // Validate required fields
        if (!contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Fetch user details from the User model
        const userDetails = await User.findById(id);

        // Get the associated profile ID from the user's additionalDetails field
        const profileId = userDetails.additionalDetails;

        // Retrieve profile details from the Profile model
        const profileDetails = await Profile.findById(profileId);

        // Update profile fields
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        // Save the updated profile details
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// Function to delete a user account
// Future improvement: Implement scheduled deletion after a waiting period
exports.deleteAccount = async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const id = req.user.id;

        // Find user details
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete associated profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

        // Future: Unenroll the user from all enrolled courses before deletion

        // Delete user account
        await User.findByIdAndDelete({ _id: id });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted due to internal error",
            error: error.message,
        });
    }
}

// Function to get user details
exports.getUserAllDetails = async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const id = req.user.id;

        // Fetch user details along with additional profile information
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        // Validate if user exists
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Unable to fetch details",
            });
        }

        // Return user details
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
const Profile = require("../models/Profile"); // Import Profile model
const User = require("../models/User"); // Import User model

// Function to update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Extract profile update fields from request body
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        // Get user ID from authenticated request
        const id = req.user.id;

        // Validate required fields
        if (!contactNumber || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Fetch user details from the User model
        const userDetails = await User.findById(id);

        // Get the associated profile ID from the user's additionalDetails field
        const profileId = userDetails.additionalDetails;

        // Retrieve profile details from the Profile model
        const profileDetails = await Profile.findById(profileId);

        // Update profile fields
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        // Save the updated profile details
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// Function to delete a user account
// Future improvement: Implement scheduled deletion after a waiting period
exports.deleteAccount = async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const id = req.user.id;

        // Find user details
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete associated profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

        // Future: Unenroll the user from all enrolled courses before deletion

        // Delete user account
        await User.findByIdAndDelete({ _id: id });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted due to internal error",
            error: error.message,
        });
    }
}

// Function to get user details
exports.getUserAllDetails = async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const id = req.user.id;

        // Fetch user details along with additional profile information
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        // Validate if user exists
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Unable to fetch details",
            });
        }

        // Return user details
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
