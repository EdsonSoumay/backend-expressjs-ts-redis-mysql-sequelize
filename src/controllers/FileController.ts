import {  NextFunction,Request, Response  } from "express";

const handleFileUpload =  (req: Request, res: Response, next: NextFunction) => {
        try {
           return res.status(200).send({message: 'Image has been uploaded successfully!'});
        } catch (error: any) {
            return res.status(500).send({ error: error.message });
        }
    }

export default {handleFileUpload}