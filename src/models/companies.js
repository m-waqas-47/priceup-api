const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "GCS",
    },
    image: {
      type: String,
      default: "images/others/company_default.jpg",
    },
    address: {
      type: String,
      default: "",
    },
    miscPricing: {
      pricingFactor: {
        type: Number,
        default: 2.42,
      },
      hourlyRate: {
        type: Number,
        default: 72,
      },
      pricingFactorStatus: {
        type: Boolean,
        default: true,
      },
    },
    fabricatingPricing: {
      oneHoleOneByTwoInchGlass: {
        type: Number,
        default: 7.74,
      },
      oneHoleThreeByEightInchGlass: {
        type: Number,
        default: 6.9,
      },
      clampCutoutOneByTwoInch: {
        type: Number,
        default: 11.61,
      },
      clampCutoutThreeByEightInch: {
        type: Number,
        default: 10.79,
      },
      hingeCutoutOneByTwoInch: {
        type: Number,
        default: 15.48,
      },
      hingeCutoutThreeByEightInch: {
        type: Number,
        default: 12.89,
      },
      minterOneByTwoInch: {
        type: Number,
        default: 0.62,
      },
      minterThreeByEightInch: {
        type: Number,
        default: 0.55,
      },
      notchOneByTwoInch: {
        type: Number,
        default: 24.51,
      },
      notchThreeByEightInch: {
        type: Number,
        default: 21.88,
      },
      outageOneByTwoInch: {
        type: Number,
        default: 6,
      },
      outageThreeByEightInch: {
        type: Number,
        default: 6,
      },
      polishPricePerOneByTwoInch: {
        type: Number,
        default: 0.16,
      },
      polishPricePerThreeByEightInch: {
        type: Number,
        default: 0.13,
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User reference is required",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("companies", companySchema);
