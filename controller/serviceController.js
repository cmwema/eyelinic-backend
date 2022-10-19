const Service = require("./../models/serviceModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllServices = catchAsync(async (req, res) => {
  const services = await Service.find();

  res.status(200).json({
    status: "success",
    results: services.length,
    data: {
      services,
    },
  });
});

exports.createService = catchAsync(async (req, res) => {
  const newService = await Service.create(req.body);
  // console.log(newService);
  res.status(201).json({
    status: "success",
    data: {
      service: newService,
    },
  });
});

exports.getService = catchAsync(async (req, res) => {
  const service = await Service.findById(req.params.id);

  res.status(200).json({
    status: "success",
    result: 1,
    data: {
      service,
    },
  });
});

exports.updateService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });
});

exports.deleteService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: {
      service,
    },
  });
});

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

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year;

  const plan = await Service.aggregate([]); //to be implemented

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
