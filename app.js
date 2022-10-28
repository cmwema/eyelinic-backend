const bp = require("body-parser");
const express = require("express");
const app = express();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errController");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
/**
 * MIDDLEWARES
 */
app.use(bp.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// USERS routes mounting
app.use("/api/v1/users", userRouter);

// SERVICES routes mounting
app.use("/api/v1/services", serviceRouter);

// for unhandled url requests(invalid urls)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// error handling
app.use(globalErrorHandler);

module.exports = app;
