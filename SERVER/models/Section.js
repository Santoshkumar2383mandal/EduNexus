const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String, // Name of the section
    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection", // References multiple subsections
            required: true,
        }
    ],
});

module.exports = mongoose.model("Section", sectionSchema);
