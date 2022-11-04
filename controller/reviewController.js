const catchAsync = require("./../utils/catchAsync");
const Review = require("./../models/reviewModel");
const handlerFactory = require("./handlerFactory");

exports.getAllReviews = catchAsync(async (req, res) => {
  // filter query variable
  let filter = req.params.serviceId ? { service: req.params.serviceId } : {};

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res) => {
  // get the service id from the url
  if (!req.body.service)
    req.body.service = req.pa6347573a1ebc5a20c52a4c35rams.serviceId;
  //gee the user id from the current user
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  // console.log(newReview);
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = handlerFactory.updateOne(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);
