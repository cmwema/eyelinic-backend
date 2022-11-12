const express = require("express");
const router = express.Router();

// controllers

const userController = require("./../controller/userController");

router.get(
  "/me",

  userController.getMe,
  userController.getUser
);

router.patch("/update-my-Password");

router.patch(
  "/update-me",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/delete-me", userController.deleteMe);

/**
 * ADMIN ROUTES
 */

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
