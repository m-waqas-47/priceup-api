const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { multerActions } = require("../../config/common");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let destinationPath = "./public/images/";
    if (req.originalUrl.includes("/finishes")) {
      destinationPath += "finishes/uploads/";
    } else if (req.originalUrl.includes("/hardwares")) {
      destinationPath += "hardwares/uploads/";
    } else if (req.originalUrl.includes("/staffs")) {
      destinationPath += "staffs/uploads/";
    } else if (req.originalUrl.includes("/companies")) {
      destinationPath += "companies/uploads/";
    } else if (req.originalUrl.includes("/glassAddons")) {
      destinationPath += "glassAddons/uploads/";
    } else if (req.originalUrl.includes("/glassTypes")) {
      destinationPath += "glassTypes/uploads/";
    } else if (req.originalUrl.includes("/users")) {
      destinationPath += "users/uploads/";
    } else if (req.originalUrl.includes("/customUsers")) {
      destinationPath += "customUsers/uploads/";
    } else if (req.originalUrl.includes("/admins")) {
      destinationPath += "admins/uploads/";
    } else if (req.originalUrl.includes("/customers")) {
      destinationPath += "customers/uploads/";
    }

    if (!fs.existsSync(destinationPath)) {
      // If not, create the directory
      fs.mkdirSync(destinationPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
        } else {
          console.log("Directory created successfully");
        }
      });
    } else {
      console.log("Directory already exists");
    }
    callback(null, destinationPath);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const addOrUpdateOrDelete = async (
  action,
  source,
  newFilePath,
  oldFilePath = ""
) => {
  return new Promise((resolve, reject) => {
    try {
      switch (action) {
        case multerActions.SAVE:
          resolve(`images/${source}/uploads/${path.basename(newFilePath)}`);
        case multerActions.PUT:
          const newImagePath = `images/${source}/uploads/${newFilePath}`;
          if (oldFilePath !== "") {
            if (oldFilePath?.startsWith(`images/${source}/uploads`)) {
              if (fs.existsSync(`public/${oldFilePath}`))
                fs.unlinkSync(`public/${oldFilePath}`);
              resolve(newImagePath);
            } else {
              resolve(newImagePath);
            }
          } else {
            resolve(newImagePath);
          }
        case multerActions.DELETE:
          if (fs.existsSync(`public/${newFilePath}`))
            fs.unlinkSync(`public/${newFilePath}`);
          resolve(true);
        default:
          resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  upload,
  addOrUpdateOrDelete,
};
