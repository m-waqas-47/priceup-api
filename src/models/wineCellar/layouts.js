const mongoose = require("mongoose");

const layoutsSchema = new mongoose.Schema(
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
            doorLock: {
                type: {
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
            channelOrClamps: {
                type: String,
                default: "Channel",
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
            glassAddon: {
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
            noOfHoursToCompleteSingleDoor:{
                type: Number,
                default: 0,
            },
            measurementSides: {
                type: Number,
                default: 2,
            },
            variant: {
                type: String,
                required: "Layout Variant is required",
            },
        },
    },
    { timestamps: true }
);
// Add the index to the company field
layoutsSchema.index({ company_id: 1 });
module.exports = mongoose.model("wine_cellar_layouts", layoutsSchema);
