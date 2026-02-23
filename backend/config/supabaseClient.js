import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("SUPABASE_URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey)

export const formatId = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.map(item => ({ ...item, _id: item.id }));
  }
  return { ...data, _id: data.id };
}

export const formatProduct = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      _id: item.id,
      coverImage: item.cover_image,
      countInStock: item.count_in_stock,
      numReviews: item.num_reviews,
      publishedDate: item.published_date,
    }));
  }
  return {
    ...data,
    _id: data.id,
    coverImage: data.cover_image,
    countInStock: data.count_in_stock,
    numReviews: data.num_reviews,
    publishedDate: data.published_date,
  };
}