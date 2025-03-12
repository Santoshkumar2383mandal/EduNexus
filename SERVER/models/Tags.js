const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
    name: {
        type: String, // Name of the tag
        required: true,
    },
    description: {
        type: String, // Description of the tag
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // References courses that use this tag
    },
});

module.exports = mongoose.model("Tags", tagSchema);
