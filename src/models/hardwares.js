const mongoose = require("mongoose");

const hardware = new mongoose.Schema(
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
      default: "images/hardwares/default.png",
    },
    operableTransom: {
      type: Boolean,
      default: false,
    },
    hardware_category_slug: {
      type: String,
      required: "Hardware Category slug is required",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    finishes: [
      {
        name: {
          type: String,
          required: "Name is required",
          minlength: [3, "Name must be atleast 3 character long"],
        },
        image: {
          type: String,
        },
        partNumber: {
          type: String,
          default: "",
        },
        cost: {
          type: Number,
          default: 0,
        },
        // thickness: {
        //   type: String,
        //   required: "Thickness value is required",
        // },
        status: {
          type: Boolean,
          default: false,
        },
        finish_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: "Finish reference is required",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("hardwares", hardware);
