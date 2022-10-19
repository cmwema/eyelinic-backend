const bp = require("body-parser");
const app = require("express")();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errController");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
/**
 * MIDDLEWARES
 */
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

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
