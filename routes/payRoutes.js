const express = require("express");

const payController = require("./../controllers/payController");

const router = express.Router();

router.post("/callback", payController.mpesaCallback);

module.exports = router;
