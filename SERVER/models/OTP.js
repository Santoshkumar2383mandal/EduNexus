const mongoose = require("mongoose");

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

module.exports = mongoose.model("OTP", OTPSchema);
