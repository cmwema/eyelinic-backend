const bp = require("body-parser");
const app = require("express")();

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

module.exports = app;
