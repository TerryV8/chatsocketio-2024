// Controller for message - CRUD

const messageModel = require("../Models/messageModel");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });

    const response = await message.save();
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during message creation: ${error.message}` });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during message find: ${error.message}` });
  }
};

module.exports = { createMessage, getMessages };
