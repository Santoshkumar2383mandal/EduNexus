const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type: String, // Gender of the user
    },
    dateOfBirth: {
        type: String, // User's date of birth
    },
    about: {
        type: String, // Short bio or about section
        trim: true,
    },
    contactNumber: {
        type: Number, // Contact number of the user
        trim: true,
    }
});

module.exports = mongoose.model("Profile", profileSchema);
