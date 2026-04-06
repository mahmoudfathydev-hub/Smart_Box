import { Product, ProductsApiResponse } from "@/redux/modules/products/types";

// Mock product data for testing
export const mockProductRows = [
  {
    id: "1",
    slug: "test-product-1",
    name: "Test Laptop",
    description: "A high-quality test laptop for development",
    short_description: "Test laptop",
    brand: "TestBrand",
    category_id: "electronics",
    price: 999.99,
    discount_price: 899.99,
    currency: "USD",
    rating: 4.5,
    stock_quantity: 10,
    images: ["https://example.com/image1.jpg"],
    specs: [{ name: "CPU", value: "Test CPU" }],
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    is_active: true,
    tags: ["new", "test"],
    sku: "TEST-LAPTOP-001",
    weight: 1.5,
    dimensions: { length: 30, width: 20, height: 2 },
  },
  {
    id: "2",
    slug: "test-product-2",
    name: "Test Phone",
    description: "A high-quality test phone for testing",
    short_description: "Test phone",
    brand: "TestBrand",
    category_id: "electronics",
    price: 699.99,
    discount_price: null,
    currency: "USD",
    rating: 4.2,
    stock_quantity: 15,
    images: ["https://example.com/image2.jpg"],
    specs: [{ name: "Screen", value: "6.1 inches" }],
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    is_active: true,
    tags: ["popular"],
    sku: "TEST-PHONE-002",
    weight: 0.2,
    dimensions: { length: 15, width: 7, height: 0.8 },
  },
  {
    id: "3",
    slug: "test-product-3",
    name: "Test Tablet",
    description: "A high-quality test tablet for development",
    short_description: "Test tablet",
    brand: "TestBrand",
    category_id: "electronics",
    price: 499.99,
    discount_price: 399.99,
    currency: "USD",
    rating: 4.0,
    stock_quantity: 8,
    images: ["https://example.com/image3.jpg"],
    specs: [{ name: "Display", value: "10.5 inches" }],
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
    is_active: true,
    tags: ["sale"],
    sku: "TEST-TABLET-003",
    weight: 0.5,
    dimensions: { length: 25, width: 18, height: 0.6 },
  },
];

// Mock products in frontend format
export const mockProducts: Product[] = mockProductRows.map((row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  shortDescription: row.short_description,
  brand: row.brand,
  categoryId: row.category_id,
  price: row.price,
  discountPrice: row.discount_price || undefined,
  currency: row.currency,
  rating: row.rating,
  stockQuantity: row.stock_quantity,
  images: row.images.map((url, index) => ({
    id: `img-${index}`,
    url,
    alt: `${row.name} - Image ${index + 1}`,
    order: index,
  })),
  specs: row.specs.map((spec, index) => ({
    id: `spec-${index}`,
    name: spec.name,
    value: spec.value,
  })),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  isActive: row.is_active,
  tags: row.tags,
  sku: row.sku,
  weight: row.weight,
  dimensions: row.dimensions,
}));

// Mock API response
export const mockApiResponse: ProductsApiResponse = {
  products: mockProducts,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: mockProducts.length,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    sortBy: "created_at",
    sortOrder: "desc",
    availability: "all",
  },
};

// Mock Supabase response
export const mockSupabaseResponse = {
  data: mockProductRows,
  error: null,
  count: mockProductRows.length,
};

// Mock empty response
export const mockEmptyResponse = {
  data: [],
  error: null,
  count: 0,
};

// Mock error response
export const mockErrorResponse = {
  data: null,
  error: { message: "Database error" },
  count: null,
};

// Mock product for single product tests
export const mockSingleProduct = mockProducts[0];

// Mock single product row
export const mockSingleProductRow = mockProductRows[0];

// Helper function to create mock product with custom properties
export const createMockProduct = (overrides: Partial<Product> = {}): Product => {
  return {
    id: "test-product-id",
    slug: "test-product",
    name: "Test Product",
    description: "Test product description",
    shortDescription: "Test short description",
    brand: "Test Brand",
    categoryId: "test-category",
    price: 99.99,
    discountPrice: undefined,
    currency: "USD",
    rating: 4.0,
    stockQuantity: 10,
    images: [],
    specs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    tags: [],
    sku: undefined,
    weight: undefined,
    dimensions: undefined,
    ...overrides,
  };
};

// Helper function to create mock API response with custom data
export const createMockApiResponse = (
  products: Product[] = mockProducts,
  paginationOverrides: Partial<ProductsApiResponse["pagination"]> = {},
  filtersOverrides: Partial<ProductsApiResponse["filters"]> = {},
): ProductsApiResponse => {
  return {
    products,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: products.length,
      itemsPerPage: 12,
      hasNextPage: false,
      hasPrevPage: false,
      ...paginationOverrides,
    },
    filters: {
      sortBy: "created_at",
      sortOrder: "desc",
      availability: "all",
      ...filtersOverrides,
    },
  };
};
