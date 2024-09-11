const express = require("express");
const customValuesController = require("../controllers/customValuesController");
const { decryptSSO } = require("../middlewares/decryptSso");
const checkApiKey = require("../middlewares/checkApiKey");

const router = express.Router();

router.get("/", checkApiKey, customValuesController.getCustomValues);
router.put(
  "/:locationId/customValues/:id",
  customValuesController.updateCustomValue
);
router.post("/:locationId", customValuesController.createCustomValue);
router.post(
  "/manageCustomValue/:locationId",
  customValuesController.manageCustomValue
);

module.exports = router;
