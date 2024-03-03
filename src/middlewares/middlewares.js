const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.resolve(__dirname, "ImageBuffer");
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const isAdmin = (req, res, next) => {
  // if (!req.user.role || req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Forbidden" });
  // }
  console.log("isAdmin middleware");
  next();
};

module.exports = { upload, isAdmin };
