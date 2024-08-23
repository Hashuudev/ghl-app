const GHLApiClient = require("../utils/GhlApiClient");
const catchAsync = require("../utils/catchAsync");

exports.getCustomValues = catchAsync(async (req, res) => {
  const { locationId } = req.query;
  const client = new GHLApiClient(); // No companyId needed in constructor
  const data = await client.getCustomValues(locationId);
  res.json(data);
});

exports.updateCustomValue = catchAsync(async (req, res) => {
  const { locationId, id } = req.params;
  const { name, value } = req.body;
  const client = new GHLApiClient(); // No companyId needed in constructor
  const data = await client.updateCustomValue(locationId, id, name, value);
  res.json(data);
});

exports.createCustomValue = catchAsync(async (req, res) => {
  const { locationId } = req.params;
  const { name, value } = req.body;

  if (!name || !value) {
    return res.status(400).json({ err: "Name and value are required." });
  }

  const client = new GHLApiClient(); // No companyId needed in constructor
  const data = await client.createCustomValue(locationId, name, value);
  res.json(data);
});

exports.manageCustomValue = catchAsync(async (req, res) => {
  const { locationId } = req.params;
  const { name, value } = req.body;
  const client = new GHLApiClient(); // No companyId needed in constructor

  const data = await client.manageCustomValue(locationId, name, value);
  res.json(data);
});
