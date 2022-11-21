const express = require("express");
const {
  postStkController,
  tokenMiddleware,
} = require("./../controllers/payController");

const router = express.Router();
router.post("/stk", tokenMiddleware, postStkController);

module.exports = router;
