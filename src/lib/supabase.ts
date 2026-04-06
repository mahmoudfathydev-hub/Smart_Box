import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Database types based on actual Add_Products table structure
 */
export type Database = {
  public: {
    Tables: {
      Add_Products: {
        Row: {
          id: number;
          created_at: string;
          name_en: string;
          name_ar: string;
          description_en: string;
          description_ar: string;
          category_ar?: string;
          category_en?: string;
          brand_ar?: string;
          brand_en?: string;
          price: number;
          discount?: number;
          stock?: number;
          sku?: string;
          images_url?: string;
          specs_en?: Record<string, string>;
          specs_ar?: Record<string, string>;
          is_active?: boolean;
          slug?: string;
          updated_at?: string;
          weight?: number;
          dimensions?: any;
          currency?: string;
          rating?: number;
          tags?: string[];
        };
        Insert: {
          id?: number;
          created_at?: string;
          name_en: string;
          name_ar: string;
          description_en: string;
          description_ar: string;
          category_ar?: string;
          category_en?: string;
          brand_ar?: string;
          brand_en?: string;
          price: number;
          discount?: number;
          stock?: number;
          sku?: string;
          images_url?: string;
          specs_en?: Record<string, string>;
          specs_ar?: Record<string, string>;
          is_active?: boolean;
          slug?: string;
          updated_at?: string;
          weight?: number;
          dimensions?: any;
          currency?: string;
          rating?: number;
          tags?: string[];
        };
        Update: {
          id?: number;
          created_at?: string;
          name_en?: string;
          name_ar?: string;
          description_en?: string;
          description_ar?: string;
          category_ar?: string;
          category_en?: string;
          brand_ar?: string;
          brand_en?: string;
          price?: number;
          discount?: number;
          stock?: number;
          sku?: string;
          images_url?: string;
          specs_en?: Record<string, string>;
          specs_ar?: Record<string, string>;
          is_active?: boolean;
          slug?: string;
          updated_at?: string;
          weight?: number;
          dimensions?: any;
          currency?: string;
          rating?: number;
          tags?: string[];
        };
      };
    };
  };
};
