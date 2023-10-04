const mongoose = require("mongoose");

const finishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be at least 3 characters long"],
    },
    slug: {
      type: String,
      required: "Slug is required",
      minlength: [3, "Slug must be at least 3 characters long"],
    },
    image: {
      type: String, // Store the filename of the image
    },
    partNumber: {
      type: String,
      default: "",
    },
    holesNeeded: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0.0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("finishes", finishSchema);
