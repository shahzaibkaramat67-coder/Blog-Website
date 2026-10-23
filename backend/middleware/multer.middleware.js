import multer from "multer"
import path from "node:path";

const tempdir = path.resolve(
  process.cwd(), "../frontend/public/temp"
)

console.log("tempdir :", tempdir);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempdir)
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

export default upload
// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/temp");
//   },

//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext)
//       .replace(/\s+/g, "")      // remove spaces
//       .replace(/[()]/g, "")     // remove brackets
//       .toLowerCase();

//     cb(null, `${name}-${Date.now()}${ext}`);
//   }
// });

// const upload = multer({ storage });
// export default upload;
