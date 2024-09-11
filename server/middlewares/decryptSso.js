const Company = require("../models/company.model");
const { authorizeLocation } = require("../utils/authorizeLocations");
const { decryptSSOData } = require("../utils/decryptSSO");

exports.decryptSSO = async (req, res) => {
  const { key } = req.body || {};
  if (!key) {
    return res.status(400).send("Please send valid key");
  }
  try {
    const data = decryptSSOData(key);
    console.log(data);

    if (data.activeLocation) {
      // Check if the location exists in the Company model
      const company = await Company.findOne({
        companyId: data.companyId,
        locationId: data.activeLocation,
      }).exec();

      if (!company) {
        // If location does not exist, authorize the location
        await authorizeLocation(data.companyId, data.activeLocation);
      }
    }

    res.send(data);
  } catch (error) {
    res.status(400).send("Invalid Key");
    console.log(error);
  }
};
