import { supabase } from "../config/supabaseClient.js";
import bcrypt from "bcrypt";
import asyncHandler from "../middleware/asyncHandler.js";
import createToken from "../utils/createtoken.js";

const createUser = asyncHandler(async (req, res) => {
  let { username, email, password } = req.body;

  username = username?.trim();
  email = email?.trim().toLowerCase();

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Fill all the inputs");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  // check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    return res.status(400).send("User email is already registered :)");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { data: savedUser, error } = await supabase
    .from("users")
    .insert([{ username, email, password_hash: hashedPassword }])
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message || "Invalid user data");
  }

  createToken(res, savedUser.id);

  res.status(201).json({
    _id: savedUser.id,
    username: savedUser.username,
    email: savedUser.email,
    isAdmin: savedUser.is_admin,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);
    if (isPasswordValid) {
      createToken(res, existingUser.id);
      res.status(201).json({
        _id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.is_admin,
      });
      return;
    }
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", " ", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { data: users, error } = await supabase.from("users").select("*");
  if (error) throw error;
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, email")
    .eq("id", req.user._id)
    .single();

  if (user) {
    res.json({ _id: user.id, username: user.username, email: user.email });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user._id)
    .single();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const updates = {
    username: req.body.username || user.username,
    email: req.body.email || user.email,
    updated_at: new Date(),
  };

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password_hash = await bcrypt.hash(req.body.password, salt);
  }

  const { data: updatedUser, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", req.user._id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    _id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.is_admin,
  });
});

const deleteById = asyncHandler(async (req, res) => {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.is_admin) {
    res.status(400);
    throw new Error("Cannot delete the admin lol");
  }

  const { error } = await supabase.from("users").delete().eq("id", req.params.id);
  if (error) throw error;

  res.json({ message: "User removed" });
});

const getUserById = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, email, is_admin")
    .eq("id", req.params.id)
    .single();

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const { data: updatedUser, error } = await supabase
    .from("users")
    .update({
      username: req.body.username,
      email: req.body.email,
      is_admin: req.body.isAdmin,
      updated_at: new Date(),
    })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error || !updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.is_admin,
  });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteById,
  getUserById,
  updateUserById,
};