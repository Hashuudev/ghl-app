const axios = require("axios");
const Company = require("../models/company.model");

class GhlApiClient {
  constructor() {
    this.baseUrl = "https://services.leadconnectorhq.com";
    this.createAxiosInstance();
  }

  createAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Version: "2021-07-28",
      },
    });
  }

  // Function to get tokens using authorization code
  async getTokens(code) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/oauth/token`,
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
    } catch (error) {
      console.error("Error fetching tokens:", error);
      throw error;
    }
  }

  // Function to get location access token using resourceId
  async getLocationAccessToken(resourceId, locationId) {
    try {
      const company = await Company.findOne({
        $or: [{ companyId: resourceId }, { locationId: resourceId }],
      });

      if (!company) {
        throw new Error("Company not found");
      }

      const accessToken = company.access_token;
      const response = await this.axiosInstance.post(
        "/oauth/locationToken",
        new URLSearchParams({
          companyId: resourceId,
          locationId,
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching location access token:", error);
      throw error;
    }
  }

  // Function to get custom values
  async getCustomValues(resourceId, locationId) {
    try {
      await this.setCompanyAccessToken(resourceId);
      const response = await this.axiosInstance.get(
        `/locations/${locationId}/customValues`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching custom values:", error);
      throw error;
    }
  }

  // Function to update a custom value
  async updateCustomValue(resourceId, locationId, id, name, value) {
    try {
      await this.setCompanyAccessToken(resourceId);
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

  // Function to create a new custom value
  async createCustomValue(resourceId, locationId, name, value) {
    try {
      await this.setCompanyAccessToken(resourceId);
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

  // Helper function to set the access token for the company
  async setCompanyAccessToken(resourceId) {
    try {
      const company = await Company.findOne({
        $or: [{ companyId: resourceId }, { locationId: resourceId }],
      });
      if (!company) {
        throw new Error("Company not found");
      }
      this.axiosInstance.defaults.headers.Authorization = `Bearer ${company.access_token}`;
    } catch (error) {
      console.error("Error setting company access token:", error);
      throw error;
    }
  }

  // Function to manage custom values (update if exists, create if not)
  async manageCustomValue(resourceId, locationId, name, value) {
    try {
      const customValues = await this.getCustomValues(resourceId, locationId);
      const existingValue = customValues.customValues.find(
        (cv) => cv.name === name
      );

      if (existingValue) {
        return await this.updateCustomValue(
          resourceId,
          locationId,
          existingValue.id,
          name,
          value
        );
      } else {
        return await this.createCustomValue(
          resourceId,
          locationId,
          name,
          value
        );
      }
    } catch (error) {
      console.error("Error managing custom value:", error);
      throw error;
    }
  }
}

module.exports = GhlApiClient;
