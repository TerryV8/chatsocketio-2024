// route for message

const {
  createMessage,
  getMessages,
} = require("../Controllers/messageController");

const express = require("express");

const router = express.Router();
router.post("/", createMessage);
router.get("/:chatId", getMessages);

module.exports = router;
