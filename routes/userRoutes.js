const express = require("express");
const router = express.Router();

// controllers
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");

/**
 * UNPROTECTED ROUTES -> Do not require user to be logged in
 */
router.post("/sign-up", authController.signUp);
router.post("/log-in", authController.logIn);
// router.get("/forgot-password", authController.forgotPassword);
router.post("/forgot-password", authController.forgotPassword);
// router.get("/reset-password/:token", authController.resetPassword);
router.patch("/reset-password/:token", authController.resetPassword);

/**
 * PROTECTED ROUTES
 */

/**
 * USER ROUTES
 */
router.use(authController.protect);

router.get(
  "/me",

  userController.getMe,
  userController.getUser
);

router.patch(
  "/update-my-Password",

  authController.updateMyPassword
);

router.patch(
  "/update-me",
  userController.uploadUserPhoto,
  userController.updateMe
);
router.delete("/delete-me", userController.deleteMe);

/**
 * ADMIN ROUTES
 */

router.use(authController.restrictTo("admin"));

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
