const mongoose = require("mongoose");
// const User = require("./userModel");
const slugify = require("slugify");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "service must have a price"],
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
    },
    opticians: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { versionKey: false }
);

serviceSchema.index({ price: 1 }); //price search ordered in ascending   in descending
serviceSchema.index({ slug: 1 });
// MIDDLEWARES
serviceSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// populating referenced documents on find wuery
serviceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "opticians",
    select: "-createdAt -payments  -dateOfBirth -phoneNumber",
  });
  next();
});

serviceSchema.set("toObject", { virtuals: true });
serviceSchema.set("toJSON", { virtuals: true });
const Service = new mongoose.model("Service", serviceSchema);
module.exports = Service;
