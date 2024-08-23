// models/Company.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const companySchema = new Schema({
  access_token: {
    type: String,
    required: true,
  },
  token_type: {
    type: String,
    required: true,
  },
  expires_in: {
    type: Number,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
  },
  locationId: {
    type: String,
  },
  companyId: {
    type: String,
    required: true,
  },
  approvedLocations: [String],
  userId: {
    type: String,
  },
  planId: {
    type: String,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
