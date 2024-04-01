const mongoose = require("mongoose");

const estimateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    isCustomizedDoorWidth: {
      type: Boolean,
      default: false,
    },
    doorWidth: {
      type: String,
      default: 0,
    },
    label: {
      type: String,
      default: "",
    },
    layout_id: {
      type: mongoose.Schema.Types.ObjectId,
      // required: "Layout reference is required",
      default: null,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Company reference is required",
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Creator reference is required",
    },
    creator_type: {
      type: String,
      required: "Creator role is required",
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Customer reference is required",
    },
    hardwareFinishes: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Hardware reference is required",
    },
    handles: {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    hinges: {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    mountingClamps: {
      wallClamp: [
        {
          type: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
          },
          count: {
            type: Number,
            default: 0,
          },
        },
      ],
      sleeveOver: [
        {
          type: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
          },
          count: {
            type: Number,
            default: 0,
          },
        },
      ],
      glassToGlass: [
        {
          type: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
          },
          count: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    cornerClamps: {
      wallClamp: [
        {
          type: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
          },
          count: {
            type: Number,
            default: 0,
          },
        },
      ],
      sleeveOver: [
        {
          type: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
          },
          count: {
            type: Number,
            default: 0,
          },
        },
      ],
      glassToGlass: [
        {
          type: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
          },
          count: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    mountingChannel: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
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
    header: {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    glassAddons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    ],
    hardwareAddons: [
      {
        type: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
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
    mitre: {
      type: Number,
      default: 0,
    },
    polish: {
      type: Number,
      default: 0,
    },
    // transom: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   default: null,
    // },
    people: {
      type: Number,
      default: 0,
    },
    hours: {
      type: Number,
      default: 0,
    },
    additionalFields: [
      {
        label: {
          type: String,
        },
        cost: {
          type: Number,
        },
      },
    ],
    measurements: [
      // {
      //   key: {
      //     type: String,
      //     default: "",
      //   },
      //   value: {
      //     type: String,
      //     default: "",
      //   },
      // },
    ],
    cost: {
      type: Number,
      required: "Total Cost is required",
    },
    status: {
      type: String,
      default: "pending",
    },
    perimeter: {
      type: Number,
      default: 0,
    },
    sqftArea: {
      type: Number,
      default: 0,
    },
    userProfitPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("estimates", estimateSchema);
