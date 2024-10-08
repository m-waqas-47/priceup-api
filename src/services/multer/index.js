const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { multerActions } = require("@config/common");
const { getMulterSource } = require("@utils/common");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let destinationPath = "./public/images/";
    if (req.originalUrl.includes("/mirrors")) {
      if (req.originalUrl.includes("/glassTypes")) {
        destinationPath += "mirrorGlassTypes/uploads/";
      } else if (req.originalUrl.includes("/edgeWorks")) {
        destinationPath += "mirrorEdgeWorks/uploads/";
      } else if (req.originalUrl.includes("/hardwares")) {
        destinationPath += "mirrorHardwares/uploads/";
      } else if (req.originalUrl.includes("/glassAddons")) {
        destinationPath += "mirrorGlassAddons/uploads/";
      }
    } else if (req.originalUrl.includes("/wineCellars")) {
      if (req.originalUrl.includes("/glassTypes")) {
        destinationPath += "wineCellarGlassTypes/uploads/";
      } else if (req.originalUrl.includes("/hardwares")) {
        destinationPath += "wineCellarHardwares/uploads/";
      } else if (req.originalUrl.includes("/finishes")) {
        destinationPath += "wineCellarFinishes/uploads/";
      } else if (req.originalUrl.includes("/glassAddons")) {
        destinationPath += "wineCellarGlassAddons/uploads/";
      }
    } else if (req.originalUrl.includes("/finishes")) {
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
      destinationPath += "companies/uploads/";
    } else if (req.originalUrl.includes("/customUsers")) {
      destinationPath += "customUsers/uploads/";
    } else if (req.originalUrl.includes("/admins")) {
      if (req.originalUrl.includes("/user")) {
        // apply this check for user CRUD perform by admin
        const role = req.query?.role;
        if (role) {
          const source = getMulterSource(role);
          destinationPath += `${source}/uploads`;
        }
      } else {
        destinationPath += "admins/uploads/";
      }
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
    // Replace spaces with hyphens in the original filename
    const modifiedFilename =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    callback(null, modifiedFilename);
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
          const newImagePath = `images/${source}/uploads/${path.basename(newFilePath)}`;
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
