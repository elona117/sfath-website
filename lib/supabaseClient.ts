import { createClient } from '@supabase/supabase-js';

// Get the URL and key from environment variables (Vite exposes them with import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Log that the client was created (safe, no real query yet)
console.log('Supabase client initialized with URL:', supabaseUrl);