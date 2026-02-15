import { parse } from "dotenv";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/ProductModel.js";
import mongoose from "mongoose";


const addProduct = asyncHandler(async (req, res) => {
    try {
        console.log('req.body:', req.body); // Your form data form-data
        // ✅ CORRECT
        const { title, author, category, genre, summary, publishedDate, language, price, countInStock, coverImage } = req.body;
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
        const product = new Product({ ...req.body });
        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: error.message });
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const updates = req.body;
        
        // Get existing product
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Validate only if the field is being updated
        if (updates.title !== undefined && !updates.title) {
            return res.status(400).json({ message: "Title cannot be empty" });
        }
        if (updates.author !== undefined && !updates.author) {
            return res.status(400).json({ message: "Author cannot be empty" });
        }
        // ... add similar checks for other fields

        // Update fields
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined && updates[key] !== null) {
                product[key] = updates[key];
            }
        });

        const updatedProduct = await product.save();
        console.log("Product updated successfully");
        console.log("Updated product:", updatedProduct);
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

const removeProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    try {
        console.log("Deleting product with id:", id);
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

const fetchProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.search) {
        filter.title = { $regex: req.query.search, $options: 'i' };
    }


    const products = await Product.find(filter).limit(limit).skip(skip).sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalProducts / limit);

    if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    } return res.status(200).json({ products, currentPage: pages, totalPages, totalProducts, hasnextPage: page < totalPages, hasPrevPage: pages > 1 });

});

const fetchProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    } return res.status(200).json(product);
})

const fetchAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('category').sort({ createdAt: -1 }).limit(12);
    if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
})


const addProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }
        console.log("User in req:", req.user);

        const review = {
            name: req.user.username,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        console.log("Review added successfully");
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(404).json({ message: "Product not found" });
        console.log("Product not found");
        throw new Error("Product not found");

    }
})

const fetchTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ ratings: -1 }).limit(4);
    if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
    if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
})

export {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts
};