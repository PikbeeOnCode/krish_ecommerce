// packages
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

// utilites
import connectDB from "./config/db.js";  // added .js here
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/Products',productRoutes);
app.use('/api/upload',uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

app.listen(PORT, () => {
  console.log("Port 3000 is listening!");
});
