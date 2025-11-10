import express from "express"
const router = express.Router();

import {createCategory} from "../controllers/categoryController.js";

// auth
import {authenticate,authorizationAdmin} from "../middleware/authMiddleware.js"

router.route("/").post(createCategory);

export default router;