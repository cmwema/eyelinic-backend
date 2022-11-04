const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// delete single document factory function
exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      throw new AppError("No document found with that ID");
    }

    res.status(204).json({
      status: "success",
      data: {
        document,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      throw new AppError("No document found with that ID", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });
