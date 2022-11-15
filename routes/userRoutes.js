const express = require("express");
const router = express.Router();
const passport = require("passport");

// controllers
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

// sign up routes
router
  .route("/signup")
  .get(authController.getSignUp)
  .post(authController.postSignUp);

router.route("/login").get(authController.getLogIn);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/api/v1/users/login" }),
  function (req, res) {
    // console.log(req.user);
    res.redirect("/api/v1/users/dashboard");
  }
);

/**
 * PROTECTED ROUTES
 */
router.get("/signout", authController.isLoggedIn, authController.getLogout);

router.get("/dashboard", authController.isLoggedIn, (req, res) => {
  res.render("dashboard", { user: req.user });
});

router.get("/profile-settings", authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  const user = req.user;
  res.render("profile-settings", { user: user });
});

router.post(
  "/update-profile",
  authController.isLoggedIn,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router
  .route("/forgot-password")
  .get(authController.getForgotPassword)
  .post(authController.postForgotPassword);

router.route("/resetPassword").get().post();

router.delete("/delete-me", authController.isLoggedIn, userController.deleteMe);

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
