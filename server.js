const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

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

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err);
});
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UnhandledException:    shutting down.....");

  server.close(() => {
    process.exit(1);
  });
});
