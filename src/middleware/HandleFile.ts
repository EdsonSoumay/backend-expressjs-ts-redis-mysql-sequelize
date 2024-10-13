import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.img || file.originalname); // Gunakan nama asli file jika req.body.img tidak ada
    }
});

// Filter untuk hanya mengizinkan file gambar
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true); // Terima file
    } else {
        cb(new Error('Only image files are allowed!')); // Tolak file
    }
};

// Buat instance multer dengan konfigurasi
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Batasi ukuran file hingga 5MB
});

// Middleware untuk meng-upload file
const fileUpload = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        upload.single('file')(req, res, (err: any) => {
            if (err) {
                return res.status(404).send({message: err.message});
            }
            next(); // Lanjutkan jika tidak ada error
        });
    };
};

export default { fileUpload };
