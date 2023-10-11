const multer = require("multer");

const storage3 = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/glassType");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

// Create a multer instance using the first storage
const updateGlassTypes = multer({ storage: storage3 });

const storage5 = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/adonsType");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

// Create a multer instance using the first storage
const updateGlassAddonss = multer({ storage: storage5 });

// Define a second storage configuration
const storage2 = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.originalUrl === "/glassTypes/save" && file.fieldname === "image") {
      callback(null, "./public/images/glassType");
    } else {
      callback(null, "./public/images/others");
    }
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

// Create a new multer instance using the second storage
const uploadGlassType = multer({ storage: storage2 });

const storage4 = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.originalUrl === "/glassAddons/save" && file.fieldname === "image") {
      callback(null, "./public/images/adonsType");
    } else {
      callback(null, "./public/images/others");
    }
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

// Create a new multer instance using the second storage
const uploadGlassAddons = multer({ storage: storage4 });


module.exports = {
  updateGlassAddonss,
  uploadGlassAddons,
  updateGlassTypes,
  uploadGlassType,
};
