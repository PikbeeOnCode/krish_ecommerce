import jwt from 'jsonwebtoken';
const generatetoken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,          // always true for production
        sameSite: "none",      // changed from "strict" to "none"
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token;
}

export default generatetoken;