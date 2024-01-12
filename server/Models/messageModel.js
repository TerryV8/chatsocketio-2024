const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: String, // message for a certain chat
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
