const mongoose = require("mongoose");

const estimateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: "Estimate category is required",
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
    status: {
      type: String,
      default: "pending",
    },
    cost: {
      type: Number,
      default: 0,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // layout_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   // required: "Layout reference is required",
    //   default: null,
    // },
    // isCustomizedDoorWidth: {
    //   type: Boolean,
    //   default: false,
    // },
    // doorWidth: {
    //   type: String,
    //   default: 0,
    // },
    // hardwareFinishes: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   default: null,
    // },
    // handles: {
    //   type: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: null,
    //   },
    //   count: {
    //     type: Number,
    //     default: 0,
    //   },
    // },
    // hinges: {
    //   type: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: null,
    //   },
    //   count: {
    //     type: Number,
    //     default: 0,
    //   },
    // },
    // mountingClamps: {
    //   wallClamp: [
    //     {
    //       type: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: null,
    //       },
    //       count: {
    //         type: Number,
    //         default: 0,
    //       },
    //     },
    //   ],
    //   sleeveOver: [
    //     {
    //       type: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: null,
    //       },
    //       count: {
    //         type: Number,
    //         default: 0,
    //       },
    //     },
    //   ],
    //   glassToGlass: [
    //     {
    //       type: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: null,
    //       },
    //       count: {
    //         type: Number,
    //         default: 0,
    //       },
    //     },
    //   ],
    // },
    // cornerClamps: {
    //   wallClamp: [
    //     {
    //       type: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: null,
    //       },
    //       count: {
    //         type: Number,
    //         default: 0,
    //       },
    //     },
    //   ],
    //   sleeveOver: [
    //     {
    //       type: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: null,
    //       },
    //       count: {
    //         type: Number,
    //         default: 0,
    //       },
    //     },
    //   ],
    //   glassToGlass: [
    //     {
    //       type: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: null,
    //       },
    //       count: {
    //         type: Number,
    //         default: 0,
    //       },
    //     },
    //   ],
    // },
    // mountingChannel: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   default: null,
    // },
    // glassType: {
    //   type: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: null,
    //   },
    //   thickness: {
    //     type: String,
    //     default: "",
    //   },
    // },
    // slidingDoorSystem: {
    //   type: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: null,
    //   },
    //   count: {
    //     type: Number,
    //     default: 0,
    //   },
    // },
    // header: {
    //   type: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: null,
    //   },
    //   count: {
    //     type: Number,
    //     default: 0,
    //   },
    // },
    // glassAddons: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: null,
    //   },
    // ],
    // hardwareAddons: [
    //   {
    //     type: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       default: null,
    //     },
    //     count: {
    //       type: Number,
    //       default: 0,
    //     },
    //   },
    // ],
    // oneInchHoles: {
    //   type: Number,
    //   default: 0,
    // },
    // hingeCut: {
    //   type: Number,
    //   default: 0,
    // },
    // clampCut: {
    //   type: Number,
    //   default: 0,
    // },
    // notch: {
    //   type: Number,
    //   default: 0,
    // },
    // outages: {
    //   type: Number,
    //   default: 0,
    // },
    // mitre: {
    //   type: Number,
    //   default: 0,
    // },
    // polish: {
    //   type: Number,
    //   default: 0,
    // },
    // people: {
    //   type: Number,
    //   default: 0,
    // },
    // hours: {
    //   type: Number,
    //   default: 0,
    // },
    // additionalFields: [
    //   {
    //     label: {
    //       type: String,
    //     },
    //     cost: {
    //       type: Number,
    //     },
    //   },
    // ],
    // measurements: [],
    // perimeter: {
    //   type: Number,
    //   default: 0,
    // },
    // sqftArea: {
    //   type: Number,
    //   default: 0,
    // },
    // userProfitPercentage: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);
// Add the index to the company field
estimateSchema.index({ company_id: 1 });
module.exports = mongoose.model("estimates", estimateSchema);
