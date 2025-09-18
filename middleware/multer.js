const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    const randomNumber = Math.floor(Math.random() * 100);
    const fileExt = file.mimetype.split("/")[1];
    const uniqueExt = `IMG_${Date.now()}${randomNumber}.${fileExt}`;
    cb(null, uniqueExt);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format, only image format allowed"));
  }
};

const limits = {
  fileSize: 1024 * 1024 * 1,
};
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
