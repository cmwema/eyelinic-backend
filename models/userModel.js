const mongoose = require("mongoose");
require("mongoose-type-email");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
      minlength: [1, "User name must be at least one character long"],
      maxlength: [30, "user name cannot be more than 30 characters long"],
      trim: true,
    },

    photo: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      required: [true, "please Enter password."],
      minlength: [8, "password must be atleast 8 characters long"],
      select: false,
    },

    role: {
      type: String,
      required: false,
      enum: ["admin", "optician", "client"],
      default: "client",
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: [true, "A user must have an email account"],
      unique: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "A user must have a date of birth"],
      min: "1900-01-01",
      max: `${new Date().getFullYear() - 18}-${new Date().getMonth()}-${
        new Date().getDate() - 1
      }`,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true,
    },
    bookings: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Booking",
      },
    ],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },

  { versionKey: false }
);

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

// querry middlewares
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }); //query only for active users
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
