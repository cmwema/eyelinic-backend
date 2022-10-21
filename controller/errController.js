const AppError = require("./../utils/appError");

const castErrorHandle = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;

  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error : ", err);

    res.status(500).json({
      status: "Error",
      message: "Something Bad Happened",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV == "production") {
    if (err.name === "CastError") {
      err.isOperational = true;
      err.message = `Invalid ${err.path} : ${err.value}`;
      err.statusCode = 400;
    }
    if (err.code === 11000) {
      err.isOperational = true;
      err.message = `Duplicate key : ${err.errmsg.match(/(["'])(\\?.)*?\1/g)}`;
      err.statusCode = 400;
    }

    sendProdError(err, res);
  }

  next();
};
