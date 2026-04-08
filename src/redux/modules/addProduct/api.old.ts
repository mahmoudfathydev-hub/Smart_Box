import { createClient } from "@supabase/supabase-js";
import { Product } from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const uploadImageToCloudinary = async (
  file: File,
  productName: string,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("productName", productName);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data.url;
};

export const createProductInSupabase = async (
  product: Omit<Product, "id" | "created_at">,
) => {
  const { data, error } = await supabase
    .from("Add_Products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("Add_Products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};
