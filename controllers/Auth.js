const User = require("../models/User"); 
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt =  require("jsonwebtoken");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

/* ---------------send otp function -------------*/
exports.sendOTP = async (req, res) => {
    try {
        // 1. Extract the email from request body
        const { email } = req.body;

        // 2. Validate email format before proceeding
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // 3. Check if user already exists in the database
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // 4. Generate a unique 6-digit OTP
        let otp;
        let result;
        do {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp }); // Check for uniqueness
        } while (result); // Repeat until a unique OTP is found

        console.log("OTP generated: ", otp);

        // 5. Store OTP in database
        await OTP.create({ email, otp });

        // 6. Send OTP via email
        const subject = "Your OTP Code";
        const body = `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`;

        const mailResponse = await mailSender(email, subject, body);

        if (!mailResponse) {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP via email",
            });
        }

        // 7. Send success response
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* -------------------------------------------------*/

/* -------------- sign up function ------------*/

exports.signUp = async (req,res)=>{
    try{
        // 1. Extract data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
        } = req.body;
        console.log(firstName+" "+lastName+" "+email+" "+password+" "+confirmPassword+" "+accountType+" "+otp);
        // 2. Validate all fields
        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        // 3. Check if password and confirm password matches
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match",
            });
        }

        // 4. Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already registered",
            });
        }

        // 5. Fetch the most recent OTP from the database
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("otp get:",recentOtp);
        // 6. Validate OTP
        if(!recentOtp|| recentOtp.length === 0){
            return res.status(400).json({
                status: false,
                message: "OTP not found",
            })
        }else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }

        // 7. Hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        // 8. Create a profile for the user
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        // 9. Store user details in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
         
        // 10. Send success response
        return res.status(200).json({
            status: true,
            message:'User is registered successfully',
            user,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to register',
        })
    }
}

/* ---------------------------------------------------------*/

/* ----------------Login ---------------------*/

exports.login = async (req,res) =>{
    try{
        // 1. Extract email and password from request body
        const {email, password} = req.body;

        // 2. Validate input fields
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields are required',
            });
        }

        // 3. Check if user exists in the database
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered, Please signup first',
            });
        }

        // 4. Verify password
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            // 5. Generate JWT token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });

            // Store token in user object (not in DB)
            user.token = token;
            user.password = undefined;

            // 6. Create a cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        } else {
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login failed, please try again',
        });
    }
}

/* ------------------------------------------ */

/* -------------changePassword-------------- */

exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      const { oldPassword, newPassword } = req.body
  
      // Verify old password
      const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password)
      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: "Old password is incorrect" })
      }

      // Hash new password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)

      // Update password in database
      await User.findByIdAndUpdate(req.user.id, { password: encryptedPassword })

      // Send success response
      return res.status(200).json({ success: true, message: "Password updated successfully" })
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
      })
    }
  }
