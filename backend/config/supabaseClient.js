import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("SUPABASE_URL:", supabaseUrl); // add this to debug

export const supabase = createClient(supabaseUrl, supabaseKey)