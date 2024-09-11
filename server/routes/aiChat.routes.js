const express = require("express");
const aiChatController = require("../controllers/aiChatController");

const router = express.Router();

router.post("/claude", aiChatController.chatAnthropicResponse);
router.post("/chatgpt", aiChatController.gptResponse);

module.exports = router;
