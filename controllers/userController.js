const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw createError(400, "Please, enter all fields");
    }

    // Check if user exist
    const isUser = await User.findOne({ email });

    if (isUser) throw createError(400, "User exists, please login");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      throw createError(400, "Invalid user data");
    }
  }),

  userLogin: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //Check email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      throw createError(400, "Invalid credentials");
    }
  }),
  getMe: asyncHandler(async (req, res, next) => {
    res.status(200).json(req.user);
  }),
};

const generateToken = (id) => {
  const { JWT_SECRET } = process.env;
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "24h" });
};
