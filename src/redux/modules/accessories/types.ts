import { AccessoryImage } from "@/types/accessory";

export interface AccessorySpec {
  id: string;
  name: string;
  value: string;
  category?: string;
}

export interface AccessoryPrice {
  amount: number;
  currency: string;
  discountAmount?: number;
  discountPercentage?: number;
}

export interface Accessory {
  id: string;
  slug: string;
  name: string;
  description: string;
  type?: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  currency: string;
  rating: number;
  stock_quantity: number;
  image_url?: string;
  compatible_devices?: string[];
  createdAt: string;
  updatedAt: string;
  status?: string;
  sku?: string;
  discount?: number;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface AccessoriesFilters {
  search?: string;
  type?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  compatibleDevices?: string[];
  sortBy?: "name" | "price" | "rating" | "created_at" | "type" | "brand";
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

export interface AccessoriesState {
  accessories: Accessory[];
  accessoryDetails: Accessory | null;
  relatedAccessories: Accessory[];
  filters: AccessoriesFilters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  accessoryDetailsLoading: boolean;
  accessoryDetailsError: string | null;
  relatedAccessoriesLoading: boolean;
  relatedAccessoriesError: string | null;
}

export interface FetchAccessoriesParams extends Partial<AccessoriesFilters> {
  page?: number;
  limit?: number;
  tags?: string[];
}

export interface CreateAccessoryRequest {
  name: string;
  description: string;
  type?: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  currency: string;
  stock_quantity: number;
  image_url?: string;
  compatible_devices?: string[];
  status?: string;
  sku?: string;
  discount?: number;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface UpdateAccessoryRequest extends Partial<CreateAccessoryRequest> {
  id: string;
}

export interface AccessoriesApiResponse {
  accessories: Accessory[];
  pagination: Pagination;
  filters: AccessoriesFilters;
}

export interface AccessoryApiResponse {
  accessory: Accessory;
}

export interface RelatedAccessoriesApiResponse {
  accessories: Accessory[];
}
