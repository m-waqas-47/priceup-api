const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.originalUrl === "/hardwares/save" && file.fieldname === "image") {
        cb(null, "public/images/newHardware");
      } else if (file.originalname.startsWith("images/newFinish/")) {
        cb(null, "public/images/newFinish");
      } else {
        cb(null, "public/images/finishes");
      }
    },
  
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const originalFileExtension = file.originalname.split(".").pop();
      const newFilename = file.fieldname + "-" + uniqueSuffix + "." + originalFileExtension;
      cb(null, newFilename);
    },
  });
  
  const upload = multer({ storage: storage });
module.exports = upload;
