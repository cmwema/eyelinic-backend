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
      enum: ["admin", "practitioner", "client"],
      default: "client",
    },
    phoneNumber: {
      type: String,
      require: [true, "User must have a phone number"],
      unique: true,
      match: /^((\+)254|0)[1-9](\d{2}){4}$/,
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
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true,
    },
    payments: [String],
    consultations: [String],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },

  { versionKey: false },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

// check for correct password -->> for log in
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// calculate age
userSchema.virtual("age").get(function () {
  const currentYear = new Date().getFullYear();
  const yearOfBirth = new Date(this.dateOfBirth).getFullYear();
  return currentYear - yearOfBirth;
});

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
