// Import the nodemailer library for sending emails.
const nodemailer = require("nodemailer");

// Function to send an email with the provided recipient email, subject (title), and body content.
const mailSender = async (email, title, body) => {
    try {
        // Create a transporter object using the provided SMTP credentials from environment variables.
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // SMTP host (e.g., Gmail, SendGrid, etc.)
            port: 587, // Add port 587 (TLS) or 465 (SSL)
            secure: false, // Use `true` for port 465, `false` for 587
            auth: {
                user: process.env.MAIL_USER, // Sender's email address
                pass: process.env.MAIL_PASS  // Sender's email password or app-specific password
            }
        });

        // Sending the email with the provided details.
        let info = await transporter.sendMail({
            from: `"EduNexus" <${process.env.MAIL_USER}>`, // Sender name
            to: `${email}`,   // Receiver email address
            subject: `${title}`,  // Email subject
            html: `${body}`, // Email body (HTML format)
        });

        console.log(info); // Log the email response
        return info; // Return the response
    } catch (error) {
        console.log(error.message); // Handle errors if email sending fails
    }
}

// Export the mailSender function for reuse in other modules.
module.exports = mailSender;
