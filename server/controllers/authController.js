const GhlApiClient = require("../utils/GhlApiClient");
const Company = require("../models/company.model");
const { decryptSSOData } = require("../utils/decryptsso");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.install = (req, res) => {
  const CLIENT_ID = process.env.GHL_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const SCOPE = process.env.GHL_APP_SCOPE;

  const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&scope=${SCOPE}`;

  res.redirect(authUrl);
};

exports.authorize = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  const ghlClient = new GhlApiClient();

  const data = await ghlClient.getTokens(code);
  console.log("Access Token:", data.access_token);
  console.log("Refresh Token:", data.refresh_token);

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
    updateResult = await Company.findOneAndUpdate({ locationId }, updateData, {
      new: true,
      upsert: true,
    }).exec();
  } else if (companyId) {
    updateResult = await Company.findOneAndUpdate({ companyId }, updateData, {
      new: true,
      upsert: true,
    }).exec();
  } else {
    return next(new AppError("No locationId or companyId provided", 400));
  }

  res.send("Authorization successful and data saved.");
});

exports.authorizeLocation = catchAsync(async (req, res, next) => {
  const { companyId, locationId } = req.query;
  const ghlClient = new GhlApiClient();

  const data = await ghlClient.getLocationAccessToken(companyId, locationId);
  console.log("Access Token:", data.access_token);
  console.log("Refresh Token:", data.refresh_token);

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
});

exports.decryptSSO = catchAsync(async (req, res, next) => {
  const { key } = req.body || {};
  if (!key) {
    return next(new AppError("Please send valid key", 400));
  }

  const data = decryptSSOData(key);
  res.send(data);
});
