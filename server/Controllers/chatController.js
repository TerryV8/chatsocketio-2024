// Controller for chat model

const chatModel = require("../Models/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    // If the chat already exists, return it
    if (chat) return res.status(200).json(chat);

    // If the chat does not exist, create it
    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during chat creation: ${error.message}` });
  }
};

// Get all the chats for a given user
const findUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await chatModel.find({
      members: {
        $in: [userId],
      },
    });

    return res.status(200).json(chats);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during chat find: ${error.message}` });
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({
      members: {
        $all: [firstId, secondId],
      },
    });

    return res.status(200).json(chat);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during chat find: ${error.message}` });
  }
};

module.exports = { createChat, findUserChats, findChat };
