const Review = require("./../models/reviewModel");
const handlerFactory = require("./handlerFactory");

exports.getAllReviews = handlerFactory.getAll(Review);

exports.createServiceUserIds = (req, res, next) => {
  // get the service id from the url
  if (!req.body.service) req.body.service = req.params.serviceId;
  //gee the user id from the current user
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createReview = handlerFactory.createOne(Review);

exports.getReview = handlerFactory.getOne(Review);

exports.updateReview = handlerFactory.updateOne(Review);

exports.deleteReview = handlerFactory.deleteOne(Review);
