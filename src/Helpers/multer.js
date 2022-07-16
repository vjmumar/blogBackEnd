const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../Assets");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({storage})
module.exports = upload;
