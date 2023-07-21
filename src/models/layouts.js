const mongoose = require("mongoose");

const layoutsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    image: {
      type: String,
      default: "",
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    settings: {
      hardwareFinishes: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      handles: {
        handleType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      hinges: {
        hingesType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      pivotHingeOption: {
        pivotHingeType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      heavyDutyOption: {
        heavyDutyType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        threshold: {
          type: Number,
          default: 0,
        },
        height: {
          type: Number,
          default: 0,
        },
      },
      heavyPivotOption: {
        heavyPivotType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        threshold: {
          type: Number,
          default: 0,
        },
        height: {
          type: Number,
          default: 0,
        },
      },
      channelOrClamps: {
        type: String,
        default: "",
      },
      mountingChannel: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      // clamps: {
      wallClamp: {
        wallClampType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      sleeveOver: {
        sleeveOverType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      glassToGlass: {
        glassToGlassType: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      // },
      glassType: {
        type: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        thickness: {
          type: String,
          default: "",
        },
      },
      slidingDoorSystem: {
        type: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      outages: {
        type: Number,
        default: 0,
      },
      transom: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      header: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      glassTreatment: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      other: {
        people: {
          type: Number,
          default: 0,
        },
        hours: {
          type: Number,
          default: 0,
        },
      },
      measurementSides: {
        type: Number,
        default: 2,
      },
      priceBySqftFormula:{
        type:String,
        default:""
      }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("layouts", layoutsSchema);
