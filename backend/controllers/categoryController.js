import categoryModel from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

const createCategory = asyncHandler(async (req, res) => {
    try {
        const {name} = req.body;
        if(!name.trim()){
            return res.status(400).json({message:"Category name is required" });
        }

        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return  res.status(400).json({message:"Category already exists" });
        }
        console.log(name);
        const category = await new categoryModel({name}).save();
        return res.status(201).json(category);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
})




const updateCategory = asyncHandler(async (req, res) => {
    try {
        const {name} = req.body;
        const {categoyId} = req.params;

        const category = await categoryModel.findById({_id:categoyId});
        if(!category){
            return res.status(404).json({message:"Category not found" });
        }

        category.name = name;
        const updateCategory = await category.save();
        return res.status(200).json(updateCategory);
        
    } catch (error) {
        console.log(error);;
        return res.status(500).json({ message: "Server Error" });
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    try {
      const removed = await categoryModel.findByIdAndDelete(req.params.categoryId);
      if (removed) {
        return  res.status(200).json({ message: "Category deleted successfully" });
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    } catch (error) {
      console.log(error);
      console.log("error in deleting category");  
      return res.status(500).json({ message: "Server Error" });
    }
});

const listCategories = asyncHandler(async (req, res) => {
    try{
        const all = await categoryModel.find({});
        if(all.length === 0){
            res.status(404).json({message:"No categories found"});
        }else{
            res.status(200).json(all);
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
}})

const readCategory = asyncHandler(async (req, res) => {
    try {
        const category =  await categoryModel.findById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});
export
{createCategory
,updateCategory,
deleteCategory,
listCategories,
readCategory
};