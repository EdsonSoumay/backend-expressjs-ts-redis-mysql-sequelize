import {  NextFunction,Request, Response  } from "express";

const handleFileUpload =  (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json('Image has been uploaded successfully!');
        } catch (error) {
            res.status(501).json(error);
        }
    }

export default {handleFileUpload}