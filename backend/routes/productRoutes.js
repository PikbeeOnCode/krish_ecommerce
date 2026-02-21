import express from "express";
import multer from "multer";
const router = express.Router();

import { authenticate, authorizationAdmin } from "../middleware/authMiddleware.js";
import checkId from "../middleware/checkId.js";
import {
addProduct,
updateProductDetails,
removeProduct,
fetchProducts,
fetchProductById,
fetchAllProducts,
addProductReview,
fetchTopProducts,
fetchNewProducts,
filterProducts
} from "../controllers/productController.js";

const upload = multer();

router
   .route('/')
   .get(fetchProducts)
   .post(authenticate, authorizationAdmin, upload.none(), addProduct);

router.route('/allproducts').get(fetchAllProducts);
router.route('/:id/reviews').post(authenticate, checkId, addProductReview);
router.route('/top').get(fetchTopProducts);
router.route('/new').get(fetchNewProducts)


router
   .route('/:id')
   .get(fetchProductById)
   .put(authenticate, authorizationAdmin, upload.none(), updateProductDetails)
   .delete(authenticate, authorizationAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);


export default router;