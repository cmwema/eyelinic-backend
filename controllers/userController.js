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

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getProfileSettings = (req, res, next) => {
  res.render("profile-settings", { user: req.user });
};
exports.updateMe = catchAsync(async (req, res, next) => {
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
  const filteredBody = filterObj(req.body, "username", "email", "phone");
  if (req.file) filteredBody.photo = req.file.filename;

  // Update user
  await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.redirect("/api/v1/users/dashboard");
});

// deleting the current user account
exports.deleteUser = catchAsync(async (req, res, next) => {
  // console.log(req.user.id)
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.redirect("/api/v1/users/dashboard");
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
