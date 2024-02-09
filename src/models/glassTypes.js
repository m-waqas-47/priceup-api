const mongoose = require("mongoose");

const glassTypes = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    slug: {
      type: String,
      required: "Slug is required",
      minlength: [3, "Slug must be atleast 3 character long"],
    },
    image: {
      type: String,
      default: "images/glassTypes/default.png",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    options: [
      {
        partNumber: {
          type: String,
          default: "",
        },
        cost: {
          type: Number,
          default: 0.0,
        },
        priceBySqFt: {
          type: Boolean,
          default: true,
        },
        thickness: {
          type: String,
          required: "Thickness value is required",
        },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("glassTypes", glassTypes);
