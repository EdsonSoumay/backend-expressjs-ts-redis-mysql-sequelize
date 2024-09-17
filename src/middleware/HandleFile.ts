import multer from "multer";

const fileUpload = () =>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/images');
        },
        filename: (req, file, cb) => {
            cb(null, req.body.img);
        }
    });
    
    const upload = multer({ storage: storage });
    return upload.single('file')
}

export default {fileUpload}