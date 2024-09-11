const CryptoJS = require("crypto-js");

function decryptSSOData(key) {
  const data = CryptoJS.AES.decrypt(key, process.env.GHL_APP_SSO_KEY).toString(
    CryptoJS.enc.Utf8
  );
  return JSON.parse(data);
}

module.exports = {
  decryptSSOData,
};
