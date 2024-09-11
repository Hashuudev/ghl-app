const axios = require("axios");
const Company = require("../models/company.model");
const { createAxiosInstance } = require("./refreshAccessToken");

async function getTokens(code) {
  const response = await axios.post(
    "https://services.leadconnectorhq.com/oauth/token",
    new URLSearchParams({
      client_id: process.env.GHL_APP_CLIENT_ID,
      client_secret: process.env.GHL_APP_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      user_type: "Company",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

async function getLocationAccessToken(companyId, locationId) {
  try {
    const company = await Company.findOne({ companyId });

    if (!company) {
      throw new Error("Company not found");
    }

    const accessToken = company.access_token;
    const axiosInstance = createAxiosInstance(companyId);

    const response = await axiosInstance.post(
      "https://services.leadconnectorhq.com/oauth/locationToken",
      new URLSearchParams({
        companyId,
        locationId,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
          Version: "2021-07-28",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching location access token:", error);
    throw error;
  }
}

module.exports = {
  getTokens,
  getLocationAccessToken,
};
