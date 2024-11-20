const mongoose = require("mongoose");

const hardwareSchema = new mongoose.Schema(
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
    image: {
      type: String,
      default: "images/others/default.png",
    },
  hardware_category_slug: {
      type: String,
      required: "Hardware Category slug is required",
  },
  fabrication: {
        oneInchHoles: {
            type: Number,
            default: 0,
        },
        hingeCut: {
            type: Number,
            default: 0,
        },
        clampCut: {
          type: Number,
          default: 0,
        },
        notch: {
          type: Number,
          default: 0,
        },
        outages: {
          type: Number,
          default: 0,
        },
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
              minlength: [3, "Name must be at-least 3 character long"],
          },
          image: {
              type: String,
              default: "images/others/default.png",
          },
          partNumber: {
              type: String,
              default: "",
          },
          cost: {
              type: Number,
              default: 0,
          },
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
// Add the index to the company field
hardwareSchema.index({ company_id: 1 });
module.exports = mongoose.model("wine_cellar_hardwares", hardwareSchema);
