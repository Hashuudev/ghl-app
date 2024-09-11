const express = require("express");
const industryController = require("../controllers/industryController");
const checkApiKey = require("../middlewares/checkApiKey");

const router = express.Router();

// Route to create a new industry
router.get("/", checkApiKey, industryController.getAllIndustries);
router.post("/", industryController.createIndustry);
router.post("/many", industryController.insertManyIndustries);
router.get(
  "/:locationId/previousAnswers",
  industryController.getPreviousAnswers
);

module.exports = router;
