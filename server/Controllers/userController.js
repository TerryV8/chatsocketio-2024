// Controller for user model

const userModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields ..." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email ..." });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Please enter a strong password, with at least 8 characters, a number, and a special character",
      });
    }

    let user = await userModel.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User with the given email already exists ..." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = createToken(user._id);

    return res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during user creation: ${error.message}` });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User with the given email does not exist ..." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password ..." });
    }

    const token = createToken(user._id);

    return res
      .status(200)
      .json({ _id: user._id, name: user.name, email, token });
  } catch (error) {}
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during user find: ${error.message}` });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error during user find: ${error.message}` });
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
