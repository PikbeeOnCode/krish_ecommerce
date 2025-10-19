import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asynchandler from '../middleware/asyncHandler.js';
import { configDotenv } from 'dotenv';

const authenticate = asynchandler(async(req,res,next)=>{
    let token;

    // read 'jwt from cookie 

    token = req.cookies.jwt;
    console.log("JWT Cookie:", req.cookies.jwt);

     if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.User = await User.findById(decoded.userId).select('-password');
            next();
        }catch(error){
            res.status(401);
            throw new Error("not authorized ,token failed");
        }
     }else{
        res.status(401);
        throw new Error("not authoriezed , token not found ")
     }
})

const authorizationAdmin = (req,res,next)=>{
    if(req.User && req.User.isAdmin){
        next();
    }else{
        res.status(401).send('not authoriezed as admin');
    }
}

export {authenticate,authorizationAdmin};