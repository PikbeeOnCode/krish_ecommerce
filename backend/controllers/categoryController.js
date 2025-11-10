import categoryModel from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const {name} = req.body
        console.log(name);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
})

export {createCategory};