import path from "path";

import multer from "multer";

const upload = multer({
    dest: "uploads/",
    limits: { filSize: 50*1024*1024 }, //50mb in size max limit
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
    fileFilter: (_req, files, cb) => {
        let ext = path.extname(file.originalname);

        if(
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext != ".webp" &&
            ext !== ".png" &&
            ext !== ".mp4"
        ){
            cb(new Error(`unsupported file type! ${ext}`),false);
            return;
        }
        cb(null, true);
    },
});

export default upload;


