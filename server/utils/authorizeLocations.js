const Company = require("../models/company.model");
const { getLocationAccessToken } = require("./getTokens");

const authorizeLocation = async (companyId, locationId) => {
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

    return updatedCompany;
  } catch (error) {
    console.error("Error fetching tokens or saving data:", error);
    throw new Error("An error occurred during location authorization");
  }
};
module.exports = {
  authorizeLocation,
};
