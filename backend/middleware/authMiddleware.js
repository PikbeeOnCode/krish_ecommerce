import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';
import asynchandler from '../middleware/asyncHandler.js';

const authenticate = asynchandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;
    console.log("JWT Cookie:", req.cookies.jwt);

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const { data: user, error } = await supabase
                .from("users")
                .select("id, username, email, is_admin")
                .eq("id", decoded.userId)
                .single();

            if (error || !user) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }

            // keeping _id so rest of your code doesn't break
            req.user = {
                _id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.is_admin,
            };

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, token not found");
    }
});

const authorizationAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send('Not authorized as admin');
    }
};

export { authenticate, authorizationAdmin };