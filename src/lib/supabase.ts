import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WikiArticle = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  views: number;
};
