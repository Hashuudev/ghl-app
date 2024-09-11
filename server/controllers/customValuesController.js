const Company = require("../models/company.model");
const { createAxiosInstance } = require("../utils/refreshAccessToken");

exports.getCustomValues = (req, res) => {
  const { locationId } = req.query;

  const axiosInstance = createAxiosInstance(locationId);

  axiosInstance
    .get(
      `https://services.leadconnectorhq.com/locations/${locationId}/customValues`,
      {
        headers: {
          Version: "2021-07-28", // Add the version header here
        },
      }
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.json({
        err: error.message,
      });
    });
};

exports.updateCustomValue = (req, res) => {
  const { locationId, id } = req.params;
  console.log(req.body);
  const { name, value } = req.body;

  const axiosInstance = createAxiosInstance(locationId);

  axiosInstance
    .put(
      `https://services.leadconnectorhq.com/locations/${locationId}/customValues/${id}`,
      { name, value },
      {
        headers: {
          Authorization: `Bearer ${req.headers.authorization}`,
          Version: "2021-07-28",
        },
      }
    )
    .then((response) => {
      console.log("Updated Custom Value:", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error updating custom value:", error);
      res.status(500).json({
        err: error.message,
      });
    });
};

exports.createCustomValue = (req, res) => {
  const { locationId } = req.params;
  const { name, value } = req.body;
  console.log(locationId);
  if (!name || !value) {
    return res.status(400).json({
      err: "Name and value are required.",
    });
  }

  const axiosInstance = createAxiosInstance(locationId);

  axiosInstance
    .post(
      `https://services.leadconnectorhq.com/locations/${locationId}/customValues`,
      { name, value },
      {
        headers: {
          Version: "2021-07-28",
        },
      }
    )
    .then((response) => {
      console.log("Created Custom Value:", response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error creating custom value:", error);
      res.status(500).json({
        err: error.message,
      });
    });
};

exports.manageCustomValue = async (req, res) => {
  const { locationId } = req.params;
  const { industryId, userAnswers, value: generatedPrompt, name } = req.body; // Extract 'name' from body

  console.log(req.body, locationId);

  const axiosInstance = createAxiosInstance(locationId);

  try {
    // Fetch existing custom values from GHL
    const response = await axiosInstance.get(
      `https://services.leadconnectorhq.com/locations/${locationId}/customValues`,
      {
        headers: {
          Version: "2021-07-28",
        },
      }
    );

    const customValues = response.data.customValues;

    // Use the provided 'name' from the body as the key for storing generatedPrompt in GHL custom values
    const promptKey = name; // Use the 'name' directly from the request body

    // Save or update the generatedPrompt in GHL custom values
    const existingPromptValue = customValues.find(
      (cv) => cv.name.toLowerCase() === promptKey.toLowerCase()
    );
    console.log(existingPromptValue);

    console.log(generatedPrompt);
    if (existingPromptValue) {
      try {
        await axiosInstance.put(
          `https://services.leadconnectorhq.com/locations/${locationId}/customValues/${existingPromptValue.id}`,
          { name: promptKey, value: generatedPrompt },
          {
            headers: {
              Version: "2021-07-28",
            },
          }
        );
        console.log(`Updated custom value for ${promptKey}`);
      } catch (error) {
        console.error(`Error updating custom value for ${promptKey}:`, error);
        return res.status(500).json({
          err: `Error updating custom value for ${promptKey}: ${error.message}`,
        });
      }
    } else {
      try {
        await axiosInstance.post(
          `https://services.leadconnectorhq.com/locations/${locationId}/customValues`,
          { name: promptKey, value: generatedPrompt },
          {
            headers: {
              Version: "2021-07-28",
            },
          }
        );
        console.log(`Created new custom value for ${promptKey}`);
      } catch (error) {
        console.error(`Error creating custom value for ${promptKey}:`, error);
        return res.status(500).json({
          err: `Error creating custom value for ${promptKey}: ${error.message}`,
        });
      }
    }

    // Save industryId, userAnswers, and generatedPrompt to MongoDB
    try {
      const company = await Company.findOne({ locationId });
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      // Update industryId, userAnswers, and generatedPrompt in MongoDB
      company.industryId = industryId;
      company.answers = userAnswers;
      company.generatedPrompt = generatedPrompt;

      await company.save();
      console.log(
        "Stored industryId, userAnswers, and generatedPrompt in the Company model"
      );

      res.status(200).json({
        message:
          "Generated prompt saved to GHL custom value and data saved to MongoDB successfully",
      });
    } catch (error) {
      console.error("Error saving data to MongoDB:", error);
      res.status(500).json({
        err: "Error saving data to MongoDB",
      });
    }
  } catch (error) {
    console.error("Error fetching custom values from GHL:", error);
    res.status(500).json({
      err: "Error fetching custom values from GHL",
    });
  }
};
