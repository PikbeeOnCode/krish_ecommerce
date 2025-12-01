import path, { extname } from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter =(req,file,cb)=>{
    const fileTypes = /jpeg|jpg|png/;
    const mimetypes = /image\/(jpeg|jpg|png|webp)/;

    const extname  = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if(fileTypes.test(extname) && mimetypes.test(mimetype)){
        cb(null,true);
    }else{
        cb(new Error("Images only!"),false);
    }

}

const upload = multer({storage,fileFilter});
const uploadSingleimage = upload.single('image');

router.post("/",(req, res) => {
    uploadSingleimage(req,res,(err)=>{
        if(err){
            res.status(400).json({message:err.message})
        }else if(req.file){
            res.status(200).send({
                message:"Image uploaded successfully",
                image:`${req.file.path.replace(/\\/g, "/")}`
            });
        }else{
            res.status(400).json({message:"Please upload an image"})
        }
    })
})

export default router;