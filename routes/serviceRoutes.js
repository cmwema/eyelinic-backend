const router = require("express").Router();

const User = require("../models/userModel");
const Service = require("../models/serviceModel");

const serviceController = require("./../controllers/serviceController");
const authController = require("./../controllers/authController");

router
  .route("/")
  .get(async (req, res) => {
    const opticians = await User.find({ role: "optician" });
    // console.log(opticians);
    res.render("service", {
      user: req.user,
      opticians,
    });
  })
  .post(
    serviceController.uploadServiceImage,
    serviceController.resizServiceCoverImage,
    serviceController.createService
  );

// router.route("/:id").get(serviceController.getService);

router
  .route("/:id")
  .get(async (req, res) => {
    const service = await Service.find({ _id: req.params.id });
    const opticians = await User.find({ role: "optician" });
    res.render("service-update", {
      user: req.user,
      service: service[0],
      opticians,
    });
  })
  .post(
    serviceController.uploadServiceImage,
    serviceController.resizServiceCoverImage,
    serviceController.updateService
  );

router
  .route("/:id/del")
  .get(async (req, res) => {
    const serviceToDel = await Service.find({ _id: req.params.id });
    const url = `/api/v1/services/${serviceToDel[0]._id}/del`;
    res.render("confirm-del", { user: req.user, serviceToDel, url });
  })
  .post(
    authController.isLoggedIn,
    serviceController.deleteService,
    (req, res) => {
      res.redirect("/api/v1/users/dashboard");
    }
  );

module.exports = router;
