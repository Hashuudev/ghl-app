const axios = require("axios");
const Company = require("../models/company.model");

class GhlApiClient {
  constructor(resourceId) {
    this.resourceId = resourceId;
    this.axiosInstance = this.createAxiosInstance(resourceId);
  }

  async refreshAccessToken() {
    try {
      // Fetch the existing company data from the database using resourceId (either companyId or locationId)
      const company = await Company.findOne({
        $or: [{ companyId: this.resourceId }, { locationId: this.resourceId }],
      });

      if (!company) {
        throw new Error("Company or Location not found");
      }

      console.log(company);
      // Get the refresh token from the company document
      const refreshToken = company.refresh_token;

      // Determine user_type based on the presence of companyId or locationId
      const userType = company.companyId ? "Company" : "Location";

      // Make the request to refresh the access token
      const response = await axios.post(
        "https://services.leadconnectorhq.com/oauth/token",
        new URLSearchParams({
          client_id: process.env.GHL_APP_CLIENT_ID,
          client_secret: process.env.GHL_APP_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          user_type: userType,
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
        { _id: company._id },
        {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: response.data.expires_in,
        }
      );

      return response.data.access_token; // Return the new access token
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
  }

  async getAccessToken() {
    const company = await Company.findOne({
      $or: [{ companyId: this.resourceId }, { locationId: this.resourceId }],
    });

    return company ? company.access_token : null;
  }

  createAxiosInstance() {
    const axiosInstance = axios.create({
      baseURL: process.env.GHL_API_DOMAIN,
    });

    axiosInstance.interceptors.request.use(
      async (requestConfig) => {
        try {
          const accessToken = await this.getAccessToken();
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
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
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

  async getCustomValues(locationId) {
    try {
      const response = await this.axiosInstance.get(
        `/locations/${locationId}/customValues`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching custom values:", error);
      throw error;
    }
  }

  async updateCustomValue(locationId, id, name, value) {
    try {
      const response = await this.axiosInstance.put(
        `/locations/${locationId}/customValues/${id}`,
        { name, value }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating custom value:", error);
      throw error;
    }
  }

  async createCustomValue(locationId, name, value) {
    try {
      const response = await this.axiosInstance.post(
        `/locations/${locationId}/customValues`,
        { name, value }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating custom value:", error);
      throw error;
    }
  }

  async manageCustomValue(locationId, name, value) {
    try {
      const customValues = await this.getCustomValues(locationId);
      const existingValue = customValues.customValues.find(
        (cv) => cv.name === name
      );

      if (existingValue) {
        return await this.updateCustomValue(
          locationId,
          existingValue.id,
          name,
          value
        );
      } else {
        return await this.createCustomValue(locationId, name, value);
      }
    } catch (error) {
      console.error("Error managing custom value:", error);
      throw error;
    }
  }
}

module.exports = GhlApiClient;
