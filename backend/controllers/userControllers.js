import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import asyncHandler from "../middleware/asyncHandler.js";
import createToken from "../utils/createtoken.js"
import { json } from "express";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Fill all the inputs");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).send("User email is already registered :)");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt);

  const newUser = new User({ username, email, password:hashedPassword });

  try {
   const savedUser =  await newUser.save();
   createToken(res,savedUser._id)

    res.status(201).json(
        {
          _id:savedUser._id,
          username:savedUser.username,
          email:savedUser.email,
          isAdmin:savedUser.isAdmin,
        }
    );
  }  catch (error) {
  console.error("User save error:", error.message);
  res.status(400);
  throw new Error(error.message || "Invalid user data");
}

});

//  creating login route

const loginUser = asyncHandler(async(req,res)=>{
  const {email,password}= req.body;
   const existingUser = await User.findOne({email});
   if(existingUser){
    const isPasswordValid = await bcrypt.compare(password,existingUser.password); 
    if(isPasswordValid){
       createToken(res,existingUser._id);
       
       res.status(201).json({
          _id:existingUser._id,
          username:existingUser.username,
          email:existingUser.email,
          isAdmin:existingUser.isAdmin,
       });
       return;
    }
   }
})

const logoutCurrentUser = asyncHandler(async(req,res)=>{
  res.cookie('jwt',' ',{
    httpOnly : true,
    expires: new Date(0),
  })
  res.status(200).json({message:"logged out sucessfully"})
})

const getAllUsers = asyncHandler(async(req,res)=>{
  const Users = await  User.find({});
  console.log(` all users : ${Users}`)
  res.json(Users)
});

const getCurrentUserProfile = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.User._id);
  if(user){
    res.json({
      _id:user._id,
      username:user.username,
      email:user.email
    })
  }else{
    res.status(404)
    throw new Error("user not found");
    
  }
})

const updateCurrentUserProfile = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.User._id);

  if(user){
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password,salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
     res.json({
      _id:updatedUser._id,
      username:updatedUser.username,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin
     })

     console.log("user is updated :");
  }else{
    console.log('user is not founded :(') 
    res.status(404);
    throw new Error("user is not found");
    
  }
})

const deleteById = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id);
  if(user){
    if(user.isAdmin){
      res.status(404);
      throw new Error("cannot delete the  admin lol ");
    }

  await user.deleteOne({_id:user._id});
  res.json({message:"user removed"});
  console.log('theuser is removed');
  }else{
    res.status(404)
    throw new Error(" user not found");
  }

});

const getUserById = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id).select('-password');
  if(user){
    res.json(
      user
    );
    
  }else{
    res.status(404);
    throw new Error("user is not found");
    
  }
})

const updateUserById = asyncHandler(async (req,res) => {
  const user = await User.findById(req.params.id);
  if(user){
     user.username = req.body.username || user.username;
     user.email = req.body.email || user.email;
     user.isAdmin = req.body.isAdmin || user.isAdmin

     const updatedUser = await user.save();
     res.json({
      _id:updatedUser._id,
      username:updatedUser.username,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin
     })

  }else{
    res.status(404)
    throw new Error("user id is not found");
    
  }
})

export { 
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteById,
  getUserById,
  updateUserById };
