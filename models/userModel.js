const mongoose = require("mongoose");
require("mongoose-type-email");
const passportLocalMongoose = require("passport-local-mongoose");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User must have a name"],
      minlength: [1, "User name must be at least one character long"],
      maxlength: [30, "user name cannot be more than 30 characters long"],
      trim: true,
    },
    phone: {
      type: String,
      match: /^((\+)254|0)[1-9](\d{2}){4}$/,
      required: [true, "a user must have a phone number"],
    },

    photo: {
      type: String,
      default: "default.jpg",
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },

  { versionKey: false }
);

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.plugin(passportLocalMongoose);

// calculate age
userSchema.virtual("age").get(function () {
  const currentYear = new Date().getFullYear();
  const yearOfBirth = new Date(this.dateOfBirth).getFullYear();
  return currentYear - yearOfBirth;
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// querry middlewares
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }); //query only for active users
  next();
});

// aggregate middlewares
userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { active: { $ne: false } } });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
