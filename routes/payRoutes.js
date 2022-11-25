const express = require("express");
const Pay = require("../models/payModel");

const {
  postStkController,
  tokenMiddleware,
  callBack,
} = require("./../controllers/payController");

const router = express.Router();
router.post("/stk", tokenMiddleware, postStkController);

router.post("/callback", async (req, res) => {
  try {
    const CallBackData = req.body;
    // console.log(CallBackData);

    if (!CallBackData.Body.stkCallback.CallbackMetadata) {
      console.log("No metadata");
      throw new Error("Payments not processed");
    } else {
      console.log(CallBackData.Body.stkCallback.CallbackMetadata);
      const Amount =
        CallBackData.Body.stkCallback.CallbackMetadata.Item[0].Value;
      const MpesaReceiptNumber =
        CallBackData.Body.stkCallback.CallbackMetadata.Item[1].Value;
      const TransactionDate =
        CallBackData.Body.stkCallback.CallbackMetadata.Item[3].Value;
      const PhoneNumber =
        CallBackData.Body.stkCallback.CallbackMetadata.Item[4].Value;

      await Pay.create({
        Amount,
        MpesaReceiptNumber,
        TransactionDate,
        PhoneNumber,
      });
      res.json("ok");
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

module.exports = router;
