const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const handlerFactory = require("./handlerFactory");
const multer = require("multer"); //file uploads
const sharp = require("sharp"); //image resizing

// =================user photo upload===================

const multerStorage = multer.memoryStorage();

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

// ================user photo resizing=============
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  if (req.file.buffer) {
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
  }

  next();
});
// =================================================

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  res.render("profile-settings", { user: req.user });
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
  const filteredBody = filterObj(req.body, "username", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // Update user
  await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.redirect("/api/v1/users/dashboard");
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
