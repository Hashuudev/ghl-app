const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for Industry
const industrySchema = new Schema({
  industryName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  openAiPrompt: {
    type: String,
    required: true,
  },
  questions: [],
});

// Create and export the Industry model
const Industry = mongoose.model("Industry", industrySchema);
module.exports = Industry;
