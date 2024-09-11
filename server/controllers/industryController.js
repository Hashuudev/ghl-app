const Company = require("../models/company.model");
const Industry = require("../models/industry.model");

// Create a new industry
exports.createIndustry = async (req, res) => {
  const { industryName, image, openAiPrompt, questions } = req.body;

  try {
    const newIndustry = new Industry({
      industryName,
      image,
      openAiPrompt,
      questions,
    });

    const savedIndustry = await newIndustry.save();
    res.status(201).json(savedIndustry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.insertManyIndustries = async (req, res) => {
  const industries = req.body;

  try {
    const result = await Industry.insertMany(industries);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all industries
exports.getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find(); // Fetch all industries from the database
    res.status(200).json(industries); // Send the list of industries as a response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors
  }
};

// Fetch previous answers along with the related industry based on locationId
exports.getPreviousAnswers = async (req, res) => {
  const { locationId } = req.params; // Use locationId from the route parameters
  console.log(locationId, "line-46");
  try {
    // Find the company by locationId and populate the industry reference
    const company = await Company.findOne({ locationId })
      .populate("industryId") // Populate the industryId to get full industry details
      .exec();

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Extract the populated industry details
    const industry = company.industryId;
    console.log(company);
    res.status(200).json({
      industry: {
        industryId: industry._id,
        industryName: industry.industryName,
        image: industry.image,
        openAiPrompt: industry.openAiPrompt,
        questions: industry.questions,
      },
      answers: company.answers,
      generatedPrompt: company.generatedPrompt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
