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
      destinationPath += "staff/uploads/";
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
      // switch (source) {
      // case multerSource.FINISHES:
      switch (action) {
        case multerActions.SAVE:
          resolve(`images/${source}/uploads/${path.basename(newFilePath)}`);
        case multerActions.PUT:
          const newImagePath = `images/${source}/uploads/${newFilePath}`;
          if (oldFilePath !== "") {
            if (oldFilePath.startsWith(`images/${source}/uploads`)) {
              fs.unlinkSync(`public/${oldFilePath}`);
              resolve(newImagePath);
            } else {
              resolve(newImagePath);
            }
          } else {
            resolve(newImagePath);
          }
        case multerActions.DELETE:
          fs.unlinkSync(`public/${newFilePath}`);
          resolve(true);
      }
      // break;
      // case multerSource.HARDWARES:
      //   break;
      // case multerSource.STAFFS:
      //   switch (action) {
      //     case multerActions.SAVE:
      //       resolve(`images/staff/uploads/${path.basename(newFilePath)}`);
      //     case multerActions.PUT:
      //       const newImagePath = `images/staff/uploads/${newFilePath}`;
      //       if (oldFilePath !== '') {
      //         if (oldFilePath.startsWith("images/staff/uploads")) {
      //           fs.unlinkSync(`public/${oldFilePath}`);
      //           resolve(newImagePath);
      //         } else {
      //           resolve(newImagePath);
      //         }
      //       } else {
      //         resolve(newImagePath);
      //       }
      //     case multerActions.DELETE:
      //       fs.unlinkSync(`public/${newFilePath}`);
      //       resolve(true);
      //   }
      // break;
      // default:
      //   resolve(true);
      //   break;
      // }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  upload,
  addOrUpdateOrDelete,
};
