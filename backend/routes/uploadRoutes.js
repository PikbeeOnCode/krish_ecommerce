import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY? "loaded" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "loaded" : "MISSING"
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "krish-ecommerce",
    allowed_formats: ["jpeg", "jpg", "png", "webp"],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();

  if (allowed.test(ext) && allowed.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only (jpeg, jpg, png, webp)"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      console.log("Upload error:", err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ message: "Please upload an image" });
    }

    console.log("Upload success:", req.file.path);
    res.status(200).json({
      message: "Image uploaded successfully",
      image: req.file.path,
      imageUrl: req.file.path
    });
  });
});

export default router;