const express = require("express");
const customValuesController = require("../controllers/customValuesController");
const { decryptSSO } = require("../middlewares/decryptSso");

const router = express.Router();

router.get("/", decryptSSO, customValuesController.getCustomValues);
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
