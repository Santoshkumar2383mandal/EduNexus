const mongoose = require("mongoose");
require("dotenv").config();

// Function to establish connection with MongoDB
exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true, // Corrected spelling
        useUnifiedTopology: true, // Corrected spelling
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error("Database connection failed");
        console.error(error);
        process.exit(1); // Exit the process with failure
    });
}
