const express = require('express');
const router = express.Router();
const autho = require("../middlewares/autho")

const {login,signUp, sendOTP, changePassword } = require('../controllers/Auth');
const {resetPasswordToken, resetPassword} = require('../controllers/ResetPassword');

//Authentication routes 

router.post("/login",login);//login route
router.post("/signup",signUp);//signup route
router.post("/sendotp",sendOTP);//sendotp route
router.post("/changePassword",changePassword);//changePassword route

//Reset Password routes

router.post("/reset-password-token",resetPasswordToken);//reset password token route
router.post("/reset-password",resetPassword);//reset password route

module.exports = router;


