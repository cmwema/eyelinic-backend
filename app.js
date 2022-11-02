const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errController");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");

const app = express();

/**
 * MIDDLEWARES
 */
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests per hour comming from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP please try again in an hour",
});
app.use("/api", limiter);

// body parser ---reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// data Sanitazation
// NoSQL injection
app.use(mongoSanitize());

// cress site scripting
app.use(xssClean());

// preventing parameter pollution
app.use(
  hpp({
    whitelist: [
      "name",
      "ratingAverage",
      "price",
      "ratingQuantity",
      "priceDiscount",
    ],
  })
);

// page routes
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// landing page
app.get("/home", (req, res, next) => {
  res.render("index");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);

// for unhandled url requests(invalid urls)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
// 1) GLOBAL MIDDLEWARES
// error handling
app.use(globalErrorHandler);

module.exports = app;
