import express, { Router } from "express";
import { 
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteById,
    getUserById,
    updateUserById
} from "../controllers/userControllers.js";
import {authenticate,authorizationAdmin} from "../middleware/authMiddleware.js"
const router = express.Router();

 router
 .route("/")
 .post(createUser)
 .get(authenticate,authorizationAdmin,getAllUsers);
 
 router.post("/auth",loginUser);
 router.post("/logout",logoutCurrentUser);
 router.
 route("/profile")
 .get(authenticate,getCurrentUserProfile)
 .put(authenticate,updateCurrentUserProfile)

//  admin routes

 router
 .route("/:id")
 .delete(authenticate,authorizationAdmin,deleteById)
 .get(authenticate,authorizationAdmin,getUserById)
 .put(authenticate,authorizationAdmin,updateUserById);

 export default router;