import express from "express";
import formidable from "express-formidable";
const router = express.Router();
// authentication

import { authenticate,authorizationAdmin } from "../middleware/authMiddleware.js";

// middleware
import checkId from "../middleware/checkId.js";

// controllers
import
 { addProduct,
    updateProductDetails,
    removeProduct,
    fetchAllProducts,
    fetchProductById
 } from "../controllers/productController.js";

router
.route('/')
.get(fetchAllProducts)
.post(authenticate,authorizationAdmin,formidable(),addProduct);


router
.route('/:id')
.get(fetchProductById)
.put(authenticate,authorizationAdmin,formidable(),updateProductDetails)
.delete(authenticate,authorizationAdmin,removeProduct);




export default router;