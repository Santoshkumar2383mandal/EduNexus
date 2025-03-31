const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// Reset Password Token Generation
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;

        // Check if user exists in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Your email is not registered with us',
            });
        }

        // Generate a unique token
        const token = crypto.randomUUID();

        // Update the User model with the token and expiration time (5 minutes)
        const updateDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resePasswordExpires: Date.now() + 24 * 60 * 60 * 1000,
            },
            { new: true }
        );

        // Create a password reset URL
        const url = `http://localhost:3000/update-password/${token}`;

        // Send the reset link via email
        await mailSender(
            email,
            "Password reset link by EduNexus",
            `Password reset link: ${url}`
        );

        // Response to the client
        return res.json({
            success: true,
            message: 'Email sent successfully. Please check your mail',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while resetting password',
        });
    }
};

// Reset Password Function
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        // Get user details from the database using the token
        const userDetails = await User.findOne({ token: token });

        // Check if token is invalid
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Invalid token',
            });
        }

        // Check if token has expired
        if (userDetails.resePasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: 'Token has expired. Please regenerate your token',
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword, token: null, resePasswordExpires: null },
            { new: true }
        );

        // Response to the client
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while resetting password',
        });
    }
};
