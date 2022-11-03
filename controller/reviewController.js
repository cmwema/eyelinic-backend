const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Review = require("./../models/reviewModel");

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);
  // console.log(newReview);
  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});
