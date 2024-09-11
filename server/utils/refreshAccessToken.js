const axios = require("axios");
const Company = require("../models/company.model");

async function refreshAccessToken(resourceId) {
  try {
    // Fetch the existing company data from the database using resourceId (either companyId or locationId)
    const company = await Company.findOne({
      $or: [{ companyId: resourceId }, { locationId: resourceId }],
    });

    if (!company) {
      throw new Error("Company or Location not found");
    }

    console.log(company);
    // Get the refresh token from the company document
    const refreshToken = company.refresh_token;

    // Determine user_type based on the presence of companyId or locationId
    const userType = company.locationId ? "Location" : "Company";
    console.log(userType);
    // Make the request to refresh the access token
    const response = await axios.post(
      "https://services.leadconnectorhq.com/oauth/token",
      new URLSearchParams({
        client_id: process.env.GHL_APP_CLIENT_ID,
        client_secret: process.env.GHL_APP_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        user_type: userType, // Use the appropriate user type
        redirect_uri: process.env.REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(response.data);

    // Update the company's access token and refresh token in the database
    await Company.findOneAndUpdate(
      { _id: company._id }, // Use the document's ID for update
      {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

function createAxiosInstance(resourceId) {
  const axiosInstance = axios.create({
    baseURL: process.env.GHL_API_DOMAIN,
  });

  axiosInstance.interceptors.request.use(
    async (requestConfig) => {
      try {
        const accessToken = await getAccessToken(resourceId);
        if (accessToken) {
          requestConfig.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      } catch (e) {
        console.error(e);
      }
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken(resourceId);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Error refreshing access token:", err);
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

async function getAccessToken(resourceId) {
  const company = await Company.findOne({
    $or: [{ companyId: resourceId }, { locationId: resourceId }],
  });

  return company ? company.access_token : null;
}

module.exports = {
  refreshAccessToken,
  createAxiosInstance,
  getAccessToken,
};
