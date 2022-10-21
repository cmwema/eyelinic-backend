const User = require("./../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllUsers = catchAsync(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("No user found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    result: 1,
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("No user found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError("No user found with that ID", 404);
  }

  res.status(204).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getUserStats = catchAsync(async (req, res) => {
  const stats = await User.aggregate([
    {
      $match: {
        age: { $gt: 0 },
      },
    },
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
        avgAge: { $avg: "$age" },
        maxAge: { $max: "$age" },
        minAge: { $min: "$age" },
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
