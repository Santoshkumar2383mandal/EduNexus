const express = require('express');
const router = express.Router();    
//importing course controller
const {createCourse, getAllCourses, getCourseDetails,editCourse} = require('../controllers/Course'); 
//importing Category controller  
const {showAllCategories,createCategory,categoryPageDetails} = require('../controllers/Category');
//importing Section controlle
const {createSection, updateSection, deleteSection} = require("../controllers/Section");
//importing sub-Section controller
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/Subsection");
//importing ratingAndReview controller
const {createRating, getAverageRating, getAllRating} = require("../controllers/RatingAndReview");
//importing middlewares
const {autho,isInstructor, isStudent, isAdmin} = require("../middlewares/autho");

// Course routes

//course can be created only by Instructor
router.post("/createCourse",autho, isInstructor,createCourse); 
//Add section
router.post("/addSection",autho,isInstructor,createSection);
//update section
router.post("/updateSection",autho,isInstructor,updateSection);
//deleteSection
router.post("/deleteSection",autho,isInstructor,deleteSection);
//add subsection to a section    
router.post("/addSubSection",autho,isInstructor,createSubSection);
//edit sub-section
router.post("/updateSubSection",autho,isInstructor,updateSubSection);
//delete sub-section
router.post("/deleteSubSection",autho,isInstructor,deleteSubSection);

//get All registered courses
router.get("/getAllCourses",getAllCourses);
//get course details
router.get("/getCourseDetails",getCourseDetails);
//edit course details
router.put("/editCourse",autho,isInstructor,editCourse);


// Category routes (only by admin)

router.post("/createCategory",autho,isAdmin,createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/categoryPageDetails",categoryPageDetails);

// Rating and Review routes
router.post("/createRating",autho,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getAllRating",getAllRating);

module.exports = router;