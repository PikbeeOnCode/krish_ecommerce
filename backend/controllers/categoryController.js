import { supabase, formatId } from "../config/supabaseClient.js";
import asyncHandler from "express-async-handler";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // check if exists
    const { data: existing } = await supabase
      .from("categories")
      .select("*")
      .eq("name", name)
      .single();

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(formatId(data));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoyId } = req.params; // keeping your original typo

    const { data, error } = await supabase
      .from("categories")
      .update({ name, updated_at: new Date() })
      .eq("id", categoyId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(formatId(data));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", req.params.categoryId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

const listCategories = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    return res.status(200).json(formatId(data));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(formatId(data));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export { createCategory, updateCategory, deleteCategory, listCategories, readCategory };