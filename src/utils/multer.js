// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./public/images/newFinish");
//   },
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// // Create a multer instance using the first storage
// const updateFinsih = multer({ storage: storage });

// const storage3 = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./public/images/newHardware");
//   },
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// // Create a multer instance using the first storage
// const updateHardwares = multer({ storage: storage3 });

// const storage2 = multer.diskStorage({
//   destination: (req, file, callback) => {
//     if (req.originalUrl === "/finishes/save" && file.fieldname === "image") {
//       callback(null, "./public/images/newFinish");
//     } else {
//       callback(null, "./public/images/finishes");
//     }
//   },
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// // Create a new multer instance using the second storage
// const uploadFinish = multer({ storage: storage2 });

// const storage4 = multer.diskStorage({
//   destination: (req, file, callback) => {
//     if (req.originalUrl === "/hardwares/save" && file.fieldname === "image") {
//       callback(null, "./public/images/newHardware");
//     } else {
//       callback(null, "./public/images/hardwares");
//     }
//   },
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// // Create a new multer instance using the second storage
// const uploadHardware = multer({ storage: storage4 });

// module.exports = {
//   updateFinsih,
//   uploadFinish,
//   updateHardwares,
//   uploadHardware
// };
const path = require("path");
const fs = require("fs");

exports.addOrUpdateOrDelete = async (
  action,
  source,
  newFilePath,
  oldFilePath = ""
) => {
  return new Promise((resolve, reject) => {
    try {
      switch (source) {
        case "finishes":
          switch (action) {
            case "save":
              resolve(`images/finishes/uploads/${path.basename(newFilePath)}`);
            case "put":
              const newImagePath = `images/finishes/uploads/${newFilePath}`;
              if (oldFilePath !== '') {
                if (oldFilePath.startsWith("images/finishes/uploads")) {
                  fs.unlinkSync(`public/${oldFilePath}`);
                  resolve(newImagePath);
                } else {
                  resolve(newImagePath);
                }
              } else {
                resolve(newImagePath);
              }
            case "delete":
              fs.unlinkSync(`public/${newFilePath}`);
              resolve(true);
          }
          break;
        case "hardwares":
          break;
        case "staffs":
          break;
        default:
          resolve(true);
          break;
      }
    } catch (error) {
      reject(error);
    }
  });
};
