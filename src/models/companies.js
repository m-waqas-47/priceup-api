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
    wineCellars:{
      doorWidth: {
        type: Number,
        default: 36,
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
        hingeCutoutOneByTwoInch: {
          type: Number,
          default: 15.48,
        },
        hingeCutoutThreeByEightInch: {
          type: Number,
          default: 12.89,
        },
        clampCutoutOneByTwoInch: {
          type: Number,
          default: 11.61,
        },
        clampCutoutThreeByEightInch: {
          type: Number,
          default: 10.79,
        },
        miterOneByTwoInch: {
          type: Number,
          default: 0.62,
        },
        miterThreeByEightInch: {
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
      glassTypesForComparison:{
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        default: []  
      }
    },
    mirrors: {
      pricingFactor: {
        type: Number,
        default: 3.1,
      },
      hourlyRate: {
        type: Number,
        default: 75,
      },
      pricingFactorStatus: {
        type: Boolean,
        default: true,
      },
      holeMultiplier: {
        type: Number,
        default: 6,
      },
      lightHoleMultiplier: {
        type: Number,
        default: 15,
      },
      notchMultiplier: {
        type: Number,
        default: 0,
      },
      singleOutletCutoutMultiplier: {
        type: Number,
        default: 6.5,
      },
      doubleOutletCutoutMultiplier: {
        type: Number,
        default: 0,
      },
      tripleOutletCutoutMultiplier: {
        type: Number,
        default: 0,
      },
      quadOutletCutoutMultiplier: {
        type: Number,
        default: 20,
      },
      glassTypesForComparison:{
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        default: []  
      }
    },
    showers: {
      doorWidth: {
        type: Number,
        default: 36,
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
        miterOneByTwoInch: {
          type: Number,
          default: 0.62,
        },
        miterThreeByEightInch: {
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
      glassTypesForComparison:{
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        default: []  
      }
    },
    pdfSettings:{
      people: {
        type: Boolean,
        default: false,
      },
      hours: {
        type: Boolean,
        default: false,
      },
      labor:{
        type: Boolean,
        default: true,
      },
      cost:{
        type: Boolean,
        default: false,
      },
      profit:{
        type: Boolean,
        default: false
      }
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User reference is required",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("companies", companySchema);
