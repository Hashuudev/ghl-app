const Industry = require("../models/industry.model");
const catchAsync = require("../utils/catchAsync");

exports.createIndustry = catchAsync(async (req, res) => {
  const { industryName, image, openAiPrompt, questions } = req.body;

  const newIndustry = new Industry({
    industryName,
    image,
    openAiPrompt,
    questions,
  });

  const savedIndustry = await newIndustry.save();
  res.status(201).json(savedIndustry);
});

exports.insertManyIndustries = catchAsync(async (req, res) => {
  const industries = req.body;

  const result = await Industry.insertMany(industries);
  res.status(201).json(result);
});

exports.getAllIndustries = catchAsync(async (req, res) => {
  const industries = await Industry.find(); // Fetch all industries from the database
  res.status(200).json(industries); // Send the list of industries as a response
});
