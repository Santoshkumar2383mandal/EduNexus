const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
    const { email, firstName, lastName, message, phoneNo, countrycode } = req.body;
    console.log(req.body);

    try {
        const emailRes = await mailSender({
            to: email,  // Ensure `to` field is provided
            subject: "Contact Form Confirmation",  // Fix argument order
            body: contactUsEmail(email, firstName, lastName, message, phoneNo, countrycode)
        });

        console.log(emailRes);
        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
