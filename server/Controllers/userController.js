// Controller for user model

const userModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");


const registerUser = (req, res) => {
  res.send("Register :à)");
};

module.exports = { registerUser };
