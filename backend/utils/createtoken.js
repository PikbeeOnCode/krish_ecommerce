import jwt from 'jsonwebtoken';
const generatetoken = (res,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"30d",
    });

    // set jwt as an http-only cookie 

res.cookie('jwt',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV !== 'devlopment',
    sameSite:"strict",
    maxAge:30*24*60*60*1000,
});

    return token;
}


export default generatetoken;
