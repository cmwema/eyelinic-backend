const express = require("express");
const router = express.Router();

// controllers
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");

router.post("/sign-up", authController.signUp);
router.post("/log-in", authController.logIn);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route("/users-stats").get(userController.getUserStats);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
