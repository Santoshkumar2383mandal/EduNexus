const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String, // User's email
        required: true,
    },
    otp: {
        type: String, // Generated OTP
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60, // OTP expires after 5 minutes
    },
});

// Function to send OTP for email verification
async function sendVerificationEmail(email, otp) {
    try {
        // Call the mailSender function and pass the email, subject, and OTP as the body.
        const mailResponse = await mailSender(email, "OTP Verification from EduNexus", otp);
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending OTP: ", error);
        throw error; // Throw error for proper error handling
    }
}

// Pre-save hook for OTP Schema to send OTP email before saving OTP to the database.
OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next(); // Move to the next middleware or save operation
});


module.exports = mongoose.model("OTP", OTPSchema);
