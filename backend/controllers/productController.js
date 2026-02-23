import { supabase, formatProduct } from "../config/supabaseClient.js";
import asyncHandler from "../middleware/asyncHandler.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { title, author, category, genre, summary, publishedDate, language, price, countInStock, coverImage } = req.body;

    switch (true) {
      case !title: return res.status(400).json({ message: "Title is required" });
      case !author: return res.status(400).json({ message: "Author is required" });
      case !category: return res.status(400).json({ message: "Category is required" });
      case !genre: return res.status(400).json({ message: "Genre is required" });
      case !summary: return res.status(400).json({ message: "Summary is required" });
      case !publishedDate: return res.status(400).json({ message: "Published Date is required" });
      case !language: return res.status(400).json({ message: "Language is required" });
      case !price: return res.status(400).json({ message: "Price is required" });
      case !countInStock: return res.status(400).json({ message: "Count In Stock is required" });
      case !coverImage: return res.status(400).json({ message: "Cover Image is required" });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{
        title,
        author,
        category_id: category,
        genre,
        summary,
        published_date: publishedDate,
        language,
        price,
        count_in_stock: countInStock,
        cover_image: coverImage,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: "Product added successfully", product: formatProduct(data) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { title, author, category, genre, summary, publishedDate, language, price, countInStock, coverImage } = req.body;

    if (title !== undefined && !title) return res.status(400).json({ message: "Title cannot be empty" });
    if (author !== undefined && !author) return res.status(400).json({ message: "Author cannot be empty" });

    const updates = {};
    if (title) updates.title = title;
    if (author) updates.author = author;
    if (category) updates.category_id = category;
    if (genre) updates.genre = genre;
    if (summary) updates.summary = summary;
    if (publishedDate) updates.published_date = publishedDate;
    if (language) updates.language = language;
    if (price) updates.price = price;
    if (countInStock) updates.count_in_stock = countInStock;
    if (coverImage) updates.cover_image = coverImage;
    updates.updated_at = new Date();

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: "Product not found" });

    res.json(formatProduct(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("products").select("*", { count: "exact" });

  if (req.query.search) {
    query = query.ilike("title", `%${req.query.search}%`);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }

  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    products: formatProduct(data),
    currentPage: page,
    totalPages,
    totalProducts: count,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  });
});

const fetchProductById = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ message: "Product not found" });

  res.status(200).json(formatProduct(data));
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) throw error;

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }

  res.status(200).json(formatProduct(data));
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, reviews(*)")
    .eq("id", req.params.id)
    .single();

  if (productError || !product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", req.params.id)
    .eq("user_id", req.user._id)
    .single();

  if (existingReview) {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  const { error: reviewError } = await supabase.from("reviews").insert([{
    product_id: req.params.id,
    user_id: req.user._id,
    name: req.user.username,
    rating: Number(rating),
    comment,
  }]);

  if (reviewError) throw reviewError;

  const { data: allReviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", req.params.id);

  const numReviews = allReviews.length;
  const ratings = allReviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

  await supabase
    .from("products")
    .update({ ratings, num_reviews: numReviews, updated_at: new Date() })
    .eq("id", req.params.id);

  res.status(201).json({ message: "Review added" });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("ratings", { ascending: false })
    .limit(4);

  if (error) throw error;
  if (!data || data.length === 0) return res.status(404).json({ message: "No products found" });

  res.json(formatProduct(data));
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw error;
  if (!data || data.length === 0) return res.status(404).json({ message: "No products found" });

  res.json(formatProduct(data));
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let query = supabase.from("products").select("*");

    if (checked && checked.length > 0) {
      query = query.in("category_id", checked);
    }

    if (radio && radio.length === 2) {
      query = query.gte("price", radio[0]).lte("price", radio[1]);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(formatProduct(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};