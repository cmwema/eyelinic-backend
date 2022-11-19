const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

// delete single document factory function
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log("deleting....");
    document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      throw new AppError("No document found with that ID");
    }
    next();
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      throw new AppError("No document found with that ID", 404);
    }

    res.redirect("/api/v1/users/dashboard");
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    console.log(req.body);
    const newDoc = await Model.create(req.body);
    res.redirect("/api/v1/users/dashboard");
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // for nexted routes to get service reviews
    let filter = req.params.serviceId ? { service: req.params.serviceId } : {};
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res) => {
    let query = await Model.findById(req.params.id);

    if (populateOptions)
      query = await Model.findById(req.params.id).populate(populateOptions);
    const doc = query;

    if (!doc) {
      throw new AppError("No document found with that ID");
    }

    res.status(200).json({
      status: "success",
      result: 1,
      data: {
        doc,
      },
    });
  });
