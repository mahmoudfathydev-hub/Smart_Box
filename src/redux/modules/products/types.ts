import { ProductImage } from "@/types/product";

export interface ProductSpec {
  id: string;
  name: string;
  value: string;
  category?: string;
}

export interface ProductPrice {
  amount: number;
  currency: string;
  discountAmount?: number;
  discountPercentage?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  brand: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  currency: string;
  rating: number;
  stockQuantity: number;
  images: ProductImage[];
  specs: ProductSpec[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ProductsFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: "in_stock" | "out_of_stock" | "all";
  tags?: string[];
  sortBy?: "name" | "price" | "rating" | "created_at" | "popularity";
  sortOrder?: "asc" | "desc";
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsState {
  products: Product[];
  productDetails: Product | null;
  relatedProducts: Product[];
  filters: ProductsFilters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  productDetailsLoading: boolean;
  productDetailsError: string | null;
  relatedProductsLoading: boolean;
  relatedProductsError: string | null;
}

export interface FetchProductsParams extends Partial<ProductsFilters> {
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription: string;
  brand: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  currency: string;
  stockQuantity: number;
  images: ProductImage[];
  specs: ProductSpec[];
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductsApiResponse {
  products: Product[];
  pagination: Pagination;
  filters: ProductsFilters;
}

export interface ProductApiResponse {
  product: Product;
}

export interface RelatedProductsApiResponse {
  products: Product[];
}
