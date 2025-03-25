const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");

// Capture payment and initiate the Razorpay payment process
exports.capturePayment = async (req, res) => {
    // Extract course ID from the request body and user ID from the authenticated user
    const { courseId } = req.body;
    const userId = req.user._id;

    // Validate course ID
    if (!courseId) {
        return res.status(400).json({
            status: false,
            message: "Course ID is required"
        });
    }

    let course;
    try {
        // Fetch course details from the database
        course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                status: false,
                message: "Course not found"
            });
        }

        // Convert user ID to MongoDB ObjectId format
        const uid = mongoose.Types.ObjectId(userId);

        // Check if the user is already enrolled in the course
        if (course.students.includes(uid)) {
            return res.status(400).json({
                status: false,
                message: "You are already enrolled in this course"
            });
        }
    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }

    // Prepare payment details
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100, // Convert amount to paise (smallest currency unit)
        currency,
        receipt: Math.random(Date.now()).toString(), // Generate a random receipt ID
        notes: {
            courseId: courseId,
            userId,
        }
    };

    try {
        // Initiate the payment using the Razorpay instance
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment order created:", paymentResponse);

        return res.status(200).json({
            status: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    } catch (error) {
        console.error("Payment initiation error:", error);
        return res.status(500).json({
            status: false,
            message: "Could not initiate payment"
        });
    }
};

// Verify Razorpay payment signature to ensure secure transaction processing
exports.verifySignature = async (req, res) => {
    const webHookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Retrieve the Razorpay signature from headers
    const signature = req.headers["x-razorpay-signature"];

    // Compute HMAC SHA256 digest
    const shasum = crypto.createHmac('sha256', webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    // Validate the signature
    if (signature === digest) {
        console.log("Request is legit");

        // Extract course and user details from payment payload
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            // Enroll the user in the course
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(404).json({
                    status: false,
                    message: "Course not found"
                });
            }

            // Update the user's enrolled courses list
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true }
            );
            console.log("User enrolled:", enrolledStudent);

            // Send confirmation email to the user
            await mailSender(
                enrolledStudent.email,
                "Congratulations! You have successfully enrolled in a course",
                "Congratulations! You have successfully enrolled in a course"
            );

            return res.status(200).json({
                status: true,
                message: "Enrollment successful"
            });

        } catch (error) {
            console.error("Error during enrollment:", error);
            return res.status(500).json({
                status: false,
                message: "Internal server error"
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "Invalid Signature"
        });
    }
};
