const bp = require("body-parser");
const app = require("express")();

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const bookingRouter = require("./routes/bookingRoutes");
/**
 * MIDDLEWARES
 */
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// USERS routes mounting
app.use("/api/v1/users", userRouter);

// SERVICES routes mounting
app.use("/api/v1/services", serviceRouter);

// PAYMENT routes mounting
app.use("/api/v1/payments", paymentRouter);

// BOOKING routes mounting
app.use("/api/v1/bookings", bookingRouter);

module.exports = app;
