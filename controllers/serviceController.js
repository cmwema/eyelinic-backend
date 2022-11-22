const Service = require("./../models/serviceModel");
const catchAsync = require("./../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const multer = require("multer"); //file uploads
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    coverImage;
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const options = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadServiceImage = options.single("coverImage");

exports.resizServiceCoverImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.body.name}-${Date.now()}.jpeg`;
  req.body.coverImage = req.file.filename;
  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/services/${req.file.filename}`);

  next();
};

exports.getAllServices = handlerFactory.getAll(Service);

exports.createService = handlerFactory.createOne(Service);

exports.getService = handlerFactory.getOne(Service, { path: "reviews" });

exports.updateService = handlerFactory.updateOne(Service);

exports.deleteService = handlerFactory.deleteOne(Service);
