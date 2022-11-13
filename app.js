const express = require("express");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const compression = require("compression");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local");
const session = require("express-session");
const User = require("./models/userModel");

// controllers // utilify functions
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errController");

// Routes
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");

const app = express();

dotenv.config({ path: "./config.env" });

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// body parser ---reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// Set security HTTP headers
app.use(helmet());
// limit requests per hour comming from same IP

// data Sanitazation
app.use(mongoSanitize());
app.use(xssClean());
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
app.use(compression());

// express session config
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy(User.authenticate()));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);

app.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

// sign up routes
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    const newUser = await User.register(
      new User({
        username: req.body.username,
        email: req.body.email,
      }),
      req.body.password
    );

    console.log(newUser);

    // log in user
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  } catch (error) {
    res.send(error);
  }
});

// login routes
app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
  })
);

app.get("/signout", (req, res, next) => {
  try {
    req.logout(function (err) {
      if (err) {
        throw err;
      }
      res.redirect("/signin");
    });
  } catch (err) {
    res.send(err);
  }
});

// for unhandled url requests(invalid urls)
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// error handling
app.use(globalErrorHandler);

// server
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("Database connected successfully!!");
  });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UnhandledException:    shutting down.....");

  server.close(() => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
