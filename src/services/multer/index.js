const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let destinationPath = "./public/images/";

    if (req.originalUrl.includes("/finishes")) {
      destinationPath += "finishes/uploads/";
    } else if (req.originalUrl.includes("/hardwares")) {
      destinationPath += "hardwares/uploads/";
    }

    callback(null, destinationPath);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};