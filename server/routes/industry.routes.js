const express = require("express");
const industryController = require("../controllers/industryController");

const router = express.Router();

// Route to create a new industry
router.get("/", industryController.getAllIndustries);
router.post("/", industryController.createIndustry);
router.post("/industries/many", industryController.insertManyIndustries);

module.exports = router;
