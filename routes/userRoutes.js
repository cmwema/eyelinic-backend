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

router.route("/signout").get(authController.getLogout);

/**
 * PROTECTED ROUTES
 */

router.use(authController.isLoggedIn);

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user });
});

router.get("/me", userController.getMe, userController.getUser);

router.patch("/update-my-Password", authController.updateMyPassword);

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
