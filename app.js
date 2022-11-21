const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const compression = require("compression");
const passport = require("passport");
const session = require("express-session");
const passportLocal = require("passport-local");
const User = require("./models/userModel");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errController");
const flash = require("connect-flash");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const payRouter = require("./routes/payRoutes");
const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// express session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// creating local strategy
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(User.authenticate()));

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

// NoSQL injection
app.use(mongoSanitize());

// cress site scripting
app.use(xssClean());

// preventing parameter pollution
app.use(
  hpp({
    whitelist: ["name", "ratingAverage", "price", "ratingQuantity"],
  })
);
// compress responses(html/ json)
app.use(compression());

// page routes
app.use("/", viewRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/pay", payRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 1) GLOBAL MIDDLEWARES
// error handling
app.use(globalErrorHandler);

module.exports = app;
