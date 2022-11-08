const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const handlerFactory = require("./handlerFactory");
const multer = require("multer");

/**
 * user photos upload
 */
// giving the image a proper name
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },

  // file name --> FORMAT = user-userid-timestamp.jpeg
  filename: (req, file, cb) => {
    const extention = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${extention}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const options = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = options.single("photo");
// ==========================================

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  // Check if user sends password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // filter out unwanted fields names
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// deleting the current user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  // console.log(req.user.id);
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
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

exports.getAllUsers = handlerFactory.getAll(User);

exports.createUser = handlerFactory.createOne(User);

exports.getUser = handlerFactory.getOne(User);

exports.updateUser = handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);
