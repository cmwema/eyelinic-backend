const Service = require("./../models/serviceModel");
const catchAsync = require("./../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.getAllServices = handlerFactory.getAll(Service);

exports.createService = handlerFactory.createOne(Service);

exports.getService = handlerFactory.getOne(Service, { path: "reviews" });

exports.updateService = handlerFactory.updateOne(Service);

exports.deleteService = handlerFactory.deleteOne(Service);

exports.getServiceStats = catchAsync(async (req, res) => {
  const stats = await Service.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: { $toUpper: "$name" },
        _id: null,
        numService: { $sum: 1 },
        avgRating: { $avg: "$ratingAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgRating: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
