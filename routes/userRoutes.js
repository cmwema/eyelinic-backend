const express = require("express");
const router = express.Router();

// controllers
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");

router.post("/sign-up", authController.signUp);
router.post("/log-in", authController.logIn);
router.get("/forgot-password", authController.forgotPassword);
router.post("/forgot-password", authController.forgotPassword);

router.get("/reset-password/:token", authController.resetPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.patch(
  "/update-my-Password",
  authController.protect,
  authController.updateMyPassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    userController.createUser
  );

router
  .route("/users-stats")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getUserStats
  );
router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = router;
