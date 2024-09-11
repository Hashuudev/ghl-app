const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/install", authController.install);
router.get("/authorize", authController.authorize);
router.get("/authorize-location", authController.authorizeLocation);
router.post("/decrypt-sso", authController.decryptSSO);

module.exports = router;
