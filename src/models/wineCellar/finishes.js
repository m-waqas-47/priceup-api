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
            default: "images/others/default.png",
        },
        partNumber: {
            type: String,
            default: "",
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
// Add the index to the company field
finishSchema.index({ company_id: 1 });
module.exports = mongoose.model("wine_cellar_finishes", finishSchema);
