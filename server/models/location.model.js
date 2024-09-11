// models/Location.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
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
    required: true,
  },
  locationId: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  approvedLocations: [String],
  userId: {
    type: String,
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
