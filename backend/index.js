// packages
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

// utilites
import connectDB from "./config/db.js";  // added .js here
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',userRoutes);

app.listen(PORT, () => {
  console.log("Port 3000 is listening!");
});
