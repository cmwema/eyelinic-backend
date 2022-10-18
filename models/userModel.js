const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: false,
      default: "client",
    },
    phoneNumber: {
      type: Number,
      require: [true, "User must have a phone number"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email account"],
      unique: true,
    },
    age: {
      type: Number,
      require: true,
    },
    services: String,
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    paymentHistory: String,
    consultations: String,
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
