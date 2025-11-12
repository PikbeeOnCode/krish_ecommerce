import express from "express"
const router = express.Router();

import
    {createCategory,
    updateCategory,
    deleteCategory,
    listCategories,
    readCategory
    } from "../controllers/categoryController.js";

// auth
import {authenticate,authorizationAdmin} from "../middleware/authMiddleware.js"

router.route("/").post(authenticate,authorizationAdmin,createCategory);
router.route("/:categoyId").put(authenticate,authorizationAdmin,updateCategory);
router.route("/:categoryId").delete(authenticate,authorizationAdmin,deleteCategory);
router.route("/categories").get(listCategories);
router.route("/:id").get(readCategory)

export default router;