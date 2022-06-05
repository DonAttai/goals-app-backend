const Goal = require("../models/Goal");
const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const User = require("../models/User");

module.exports = {
  //get all goals
  getGoals: asyncHandler(async (req, res, next) => {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
  }),

  //set goal
  setGoal: asyncHandler(async (req, res, next) => {
    if (!req.body.text) throw createError(400, "Please, enter a text");
    const goal = await Goal.create({
      text: req.body.text,
      user: req.user.id,
    });
    res.status(201).json(goal);
  }),

  //update goal
  updateGoal: asyncHandler(async (req, res, next) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) throw createError(400, "Goal not found");

    //check for user
    if (!req.user) throw createError(401, "User not found");

    //check if the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id)
      throw createError(401, "User not authorized");

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedGoal);
  }),

  //delete goal
  deleteGoal: asyncHandler(async (req, res, next) => {
    const goalId = req.params.id;
    const goal = await Goal.findById(goalId);
    if (!goal) throw createError(404, "Goal not found");

    //check for user
    if (!req.user) throw createError(401, "User not found");

    //check if the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id)
      throw createError(401, "User not authorized");

    await goal.remove();
    res.status(200).json(goalId);
  }),
};
