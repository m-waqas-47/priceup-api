const mongoose = require("mongoose");

const hardwareCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be at-least 3 character long"],
    },
    slug: {
      type: String,
      required: "Slug is required",
      minlength: [3, "Slug must be at-least 3 character long"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wine_cellar_hardware_categories", hardwareCategorySchema);
