const Payment = require("./../models/paymentModel");

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    res.status(200).json({
      status: "success",
      results: payments.length,
      data: {
        payments,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    // console.log(newPayment);
    res.status(201).json({
      status: "success",
      data: {
        payment: newPayment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    res.status(200).json({
      status: "success",
      result: 1,
      data: {
        payment,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

// exports.updatePayment = async (req, res) => {
//   try {
//     const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: "success",
//       data: {
//         payment,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// exports.deletePayment = async (req, res) => {
//   try {
//     const payment = await Payment.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "success",
//       data: {
//         payment,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };
