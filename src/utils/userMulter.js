const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/newUsers");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

// Create a multer instance using the first storage
const updateUsers = multer({ storage: storage });


const storage2 = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.originalUrl === "/users/save" && file.fieldname === "image") {
      callback(null, "./public/images/newUsers");
    } else {
      callback(null, "./public/images/users");
    }
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

// Create a new multer instance using the second storage
const uploadUsers = multer({ storage: storage2 });

module.exports = {
    updateUsers,
    uploadUsers,
};

