const API_KEY = process.env.API_KEY; // Store your API key in environment variables

// Middleware function to check API key
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["authorization"];
  console.log("reciewve", apiKey);
  if (apiKey && apiKey === `Bearer ${API_KEY}`) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Forbidden: You are not allowed to access" });
  }
};

module.exports = checkApiKey;
