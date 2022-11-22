const axios = require("axios");

const tokenMiddleware = async (req, res, next) => {
  const secreteKey = process.env.MPESA_COSUMER_SECRET;
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const auth = new Buffer.from(`${consumerKey}:${secreteKey}`).toString(
    "base64"
  );
  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data.access_token);
      token = response.data.access_token;
      next();
    })
    .catch((err) => {
      console.log(err.message);
      res.status(err.statusCode).json(err.message);
    });
};

const postStkController = async (req, res) => {
  const shortCode = 174379;
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  const passkey = process.env.MPESA_PASSKEY;
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );
  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: "174379",
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://9daf-41-89-160-17.in.ngrok.io/api/v1/pay/callback",
    AccountReference: "Test",
    TransactionDesc: "Test",
  };

  await axios
    .post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);

      res.status(200).json(response.data.ResponseDescription);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
};

//exporting post controllers;
module.exports = {
  postStkController,
  tokenMiddleware,
};
