const { decryptSSOData } = require("../utils/decryptsso");

exports.decryptSSO = async (req, res, next) => {
  const key = req.headers["key"]; // Get the key from the headers

  if (!key) {
    return res.status(400).send("Please send a valid key");
  }

  try {
    const data = decryptSSOData(key);
    console.log(data);
    next();
  } catch (error) {
    res.status(400).send("Invalid Key");
    console.log(error);
  }
};
