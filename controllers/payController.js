const axios = require("axios");
const Pay = require("../models/payModel");

exports.generateToken = async (req, res, next) => {
  const secret = process.env.consumer_secret;
  const consumer = process.env.consumer_key;

  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");

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
      console.log(err);
      res.status(400).json(err.message);
    });
};

exports.mpesaPayMent = async (req, res, next) => {
  try {
    const phone = req.body.phone;
    const amount = +req.body.amount;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + date.getMonth() + 1).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const shortcode = process.env.mpesa_paybill;
    const passkey = process.env.passkey;

    const password = new Buffer.from(shortcode + passkey + timestamp).toString(
      "base64"
    );

    await axios
      .post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phone,
          PartyB: shortcode,
          PhoneNumber: phone,
          CallBackURL: "https://eyelinic.onrender.com/api/v1/pay/callback",
          AccountReference: phone,
          TransactionDesc: "Book service",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return res.redirect("/api/v1/bookings");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err.message);
      });
  } catch (err) {
    console.log(err);
  }
};

exports.mpesaCallback = async (req, res, next) => {
  try {
    console.log("hello from call back");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
};
