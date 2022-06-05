const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const createError = require("http-errors");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];

      //Verify token
      const verify = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from the token
      req.user = await User.findById(verify.id).select("-password");

      next();
    } catch (error) {
      throw createError(401, "Not authorized");
    }
  }
  if (!token) throw createError(401, "Not authorized, no token");
});
module.exports = protect;
