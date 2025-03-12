const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
    title: {
        type: String, // Title of the subsection
    },
    timeDuration: {
        type: String, // Duration of the video
    },
    description: {
        type: String, // Brief description of the subsection
    },
    videoUrl: {
        type: String, // URL of the video content
    },
});

module.exports = mongoose.model("SubSection", subSectionSchema);
