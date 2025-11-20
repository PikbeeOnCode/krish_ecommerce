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
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts
 } from "../controllers/productController.js";

router
.route('/')
.get(fetchProducts)
.post(authenticate,authorizationAdmin,formidable(),addProduct);

router.route('/allproducts').get(fetchAllProducts);
router.route('/:id/reviews').post(authenticate,authorizationAdmin,checkId,addProductReview);
router.route('/top').get(fetchTopProducts);
router.route('/new').get(fetchNewProducts)


router
.route('/:id')
.get(fetchProductById)
.put(authenticate,authorizationAdmin,formidable(),updateProductDetails)
.delete(authenticate,authorizationAdmin,removeProduct);




export default router;