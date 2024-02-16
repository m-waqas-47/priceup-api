const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userRoles } = require("../config/common");
const customUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    email: {
      type: String,
      required: "Email is required",
      match: /.+\@.+\..+/,
      unique: true,
    },
    image: {
      type: String,
      default: "images/users/default.jpg",
    },
    role: {
      type: String,
      default: "admin",
    },
    status: {
      type: Boolean,
      default: true,
    },
    locationsAccess: [
      {
        company_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: "Company reference is required",
        },
        company_password: {
          type: String,
          required: "Password is required",
          minlength: [6, "Password must be atleast 6 character long"],
        },
      },
    ],
  },
  { timestamps: true }
);

// customUserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

customUserSchema.methods.comparePassword = function (password) {
  return this.locationsAccess.find((item) =>
    bcrypt.compareSync(password, item.company_password)
  );
};

customUserSchema.methods.generateJwt = function (companyId) {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      image: this.image,
      company_id: companyId,
      role: userRoles.ADMIN,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = mongoose.model("customUsers", customUserSchema);
