const router = require("express").Router();
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);
router.get("/me", protect, userController.getMe);
module.exports = router;
