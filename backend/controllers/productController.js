import { parse } from "dotenv";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/ProductModel.js";
import mongoose from "mongoose";


const addProduct = asyncHandler(async(req,res)=>{
    try {
        const { title, author, category, genre, summary, publishedDate, language, price, countInStock, coverImage } = req.fields;
        
        switch (true) {
            case !title:
                return res.status(400).json({ message: "Title is required" });
            case !author:
                return res.status(400).json({ message: "Author is required" });
            case !category:
                return res.status(400).json({ message: "Category is required" });
            case !genre:
                return res.status(400).json({ message: "Genre is required" });
            case !summary:
                return res.status(400).json({ message: "Summary is required" });
            case !publishedDate:
                return res.status(400).json({ message: "Published Date is required" });
            case !language:
                return res.status(400).json({ message: "Language is required" });
            case !price:
                return res.status(400).json({ message: "Price is required" });  
            case !countInStock:
                return res.status(400).json({ message: "Count In Stock is required" });
            case !coverImage:
                return res.status(400).json({ message: "Cover Image is required" });    
        }

        const product = new Product({...req.fields});
        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ message: "Server Error" });
    }
});


const updateProductDetails = asyncHandler(async(req,res)=>{
    try{
        const { title, author, category, genre, summary, publishedDate, language, price, countInStock, coverImage } = req.fields;
        
        switch (true) {
            case !title:
                return res.status(400).json({ message: "Title is required" });
            case !author:
                return res.status(400).json({ message: "Author is required" });
            case !category:
                return res.status(400).json({ message: "Category is required" });
            case !genre:
                return res.status(400).json({ message: "Genre is required" });
            case !summary:
                return res.status(400).json({ message: "Summary is required" });
            case !publishedDate:
                return res.status(400).json({ message: "Published Date is required" });
            case !language:
                return res.status(400).json({ message: "Language is required" });
            case !price:
                return res.status(400).json({ message: "Price is required" });  
            case !countInStock:
                return res.status(400).json({ message: "Count In Stock is required" });
            case !coverImage:
                return res.status(400).json({ message: "Cover Image is required" });    
        }

        const product = await Product.findByIdAndUpdate(req.params.id,{...req.fields},{new:true});
        await product.save();
        res.status(200).json({ message: "Product updated successfully", product });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
})

const removeProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    try {
        console.log("Deleting product with id:", id);
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message:"Product not found" });
        }return res.status(200).json({message:"Product deleted successfully"  });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    const pages = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (pages - 1) * limit;
     const filter = {};

     if(req.query.search){
        filter.title = { $regex: req.query.search, $options: 'i' };
    }


    const products =  await Product.find(filter).limit(limit).skip(skip).sort({createdAt:-1});

    const totalproducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalproducts / limit);

    if(products.length === 0){
        return res.status(404).json({message:"No products found" });
    }return res.status(200).json({products,currentPage:pages,totalPages,totalproducts,hasnextPage:pages<totalPages,hasPrevPage:pages>1});

});

const fetchProductById = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    } 
    
    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({message:"Product not found" });
    }return res.status(200).json(product);
})

  

export
 {addProduct,
updateProductDetails,
removeProduct,
fetchAllProducts,
fetchProductById
 };