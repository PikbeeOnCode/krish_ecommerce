import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// ---------- MULTER STORAGE ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// ---------- FILE FILTER ----------
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

// ---------- ROUTE ----------
router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Normalize path (fixes Windows backslash issue)
    const image = req.file.path.replace(/\\/g, "/");

    res.status(200).json({
      message: "Image uploaded successfully",
      image: `/${image}`,                           // for saving to DB
      imageUrl: `http://localhost:3000/${image}`    // for frontend preview
    });
  });
});

export default router;
