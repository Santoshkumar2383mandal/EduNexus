const express = require('express');
const router = express.Router();

const {autho, isInstructor} = require("../middlewares/autho");

const {deleteAccount, updateProfile, getUserAllDetails,updateDisplayPicture} = require('../controllers/Profile');

//profile routes

//delete User account
router.delete("/deleteProfile",autho,deleteAccount);
router.put("/updateProfile",autho,updateProfile);
router.get("/getAllUserDetails",autho,isInstructor,getUserAllDetails);
router.put("/updateDisplayPicture",autho,updateDisplayPicture)

module.exports = router;
