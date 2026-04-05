export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id?: string;
  created_at?: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category_en: string;
  category_ar: string;
  brand_en: string;
  brand_ar: string;
  price: number;
  discount: number;
  stock: number;
  sku: string;
  images_url: string[];
  specs_en: ProductSpecs;
  is_active: boolean;
}

export interface AddProductState {
  product: Product;
  loading: boolean;
  error: string | null;
  errors: Record<string, string>;
  success: boolean;
  uploadingImages: boolean;
}
