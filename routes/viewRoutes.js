const express = require("express");
const viewController = require("../controller/viewController");
const router = express.Router();

router.get("/", viewController.overview);

router.get("/sign-in", viewController.signIn);

router.get("/sign-up", viewController.signUp);

router.get("/forgot-password", viewController.forgotPassword);

router.get("/change-password", viewController.updatePassword);

router.get("/profile-settings", viewController.profileSettings);

router.get("/payment", viewController.payment);

module.exports = router;
