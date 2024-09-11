const axios = require("axios");
const Company = require("../models/company.model");
const { getLocationAccessToken, getTokens } = require("../utils/getTokens");
const { decryptSSOData } = require("../utils/decryptsso");
const { authorizeLocation } = require("../utils/authorizeLocations");

exports.install = (req, res) => {
  const CLIENT_ID = process.env.GHL_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const SCOPE = process.env.GHL_APP_SCOPE;

  const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=${SCOPE}`;

  res.redirect(authUrl);
};

exports.authorize = async (req, res) => {
  const { code } = req.query;

  try {
    const data = await getTokens(code);
    console.log("Access Token:", data.access_token);
    console.log("Refresh Token:", data.refresh_token);
    console.log(data);

    const {
      locationId,
      companyId,
      access_token,
      refresh_token,
      scope,
      expires_in,
      userType,
    } = data;

    const updateData = {
      access_token,
      refresh_token,
      scope,
      expires_in,
      userType,
      companyId,
      locationId,
    };

    let updateResult;

    if (locationId) {
      updateResult = await Company.findOneAndUpdate(
        { locationId },
        updateData,
        { new: true, upsert: true }
      ).exec();
    } else if (companyId) {
      updateResult = await Company.findOneAndUpdate({ companyId }, updateData, {
        new: true,
        upsert: true,
      }).exec();
    } else {
      return res.status(400).send("No locationId or companyId provided");
    }

    res.send("Authorization successful and data saved.");
  } catch (error) {
    console.error("Error fetching tokens or saving data:", error);
    res.status(500).send("An error occurred");
  }
};

exports.authorizeLocation = async (req, res) => {
  const { companyId, locationId } = req.query;

  try {
    const data = await getLocationAccessToken(companyId, locationId);
    console.log("Access Token:", data.access_token);
    console.log("Refresh Token:", data.refresh_token);
    console.log(data);

    const { access_token, refresh_token, scope, expires_in, userType } = data;

    const updateData = {
      access_token,
      refresh_token,
      scope,
      expires_in,
      userType,
      companyId,
      locationId,
    };

    const updatedCompany = await Company.findOneAndUpdate(
      { locationId },
      updateData,
      { new: true, upsert: true }
    ).exec();

    res.send("Authorization successful and data saved.");
  } catch (error) {
    console.error("Error fetching tokens or saving data:", error);
    res.status(500).send("An error occurred");
  }
};
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
