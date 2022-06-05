const router = require("express").Router();
const goalsController = require("../controllers/goalsController");
const protect = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, goalsController.getGoals)
  .post(protect, goalsController.setGoal);
router
  .route("/:id")
  .put(protect, goalsController.updateGoal)
  .delete(protect, goalsController.deleteGoal);

module.exports = router;
