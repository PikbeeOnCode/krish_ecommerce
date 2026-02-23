import express from "express"
const router = express.Router();

import {
    createCategory,
    updateCategory,
    deleteCategory,
    listCategories,
    readCategory
} from "../controllers/categoryController.js";

import { authenticate, authorizationAdmin } from "../middleware/authMiddleware.js"

// static routes FIRST
router.route("/categories").get(listCategories);
router.route("/").post(authenticate, authorizationAdmin, createCategory);

// dynamic routes AFTER
router.route("/:categoyId").put(authenticate, authorizationAdmin, updateCategory);
router.route("/:categoryId").delete(authenticate, authorizationAdmin, deleteCategory);
router.route("/:id").get(readCategory);

export default router;