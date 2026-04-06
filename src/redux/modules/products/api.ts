import {
  Product,
  ProductsApiResponse,
  ProductApiResponse,
  RelatedProductsApiResponse,
  FetchProductsParams,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ProductsApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log("=== PRODUCTS API DEBUG ===");
    console.log("API Request:", { url, options });

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log("Sending fetch request...");
      const response = await fetch(url, config);

      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData);
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error(
          `Expected JSON response but received ${contentType || "unknown content type"}. ` +
            `Response starts with: ${text.substring(0, 100)}...`,
        );
      }

      const data = await response.json();
      console.log("API Response Data:", data);
      console.log("=== END PRODUCTS API DEBUG ===");

      return data;
    } catch (error) {
      console.error("=== PRODUCTS API ERROR ===");
      console.error("Network/API error:", error);
      console.error("Error type:", typeof error);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : "Unknown error",
      );

      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  async getProducts(
    params: FetchProductsParams = {},
  ): Promise<ProductsApiResponse> {
    const searchParams = new URLSearchParams();

    // Add pagination
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    // Add filters
    if (params.search) searchParams.set("search", params.search);
    if (params.category) searchParams.set("category", params.category);
    if (params.brand) searchParams.set("brand", params.brand);
    if (params.minPrice)
      searchParams.set("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      searchParams.set("maxPrice", params.maxPrice.toString());
    if (params.rating) searchParams.set("rating", params.rating.toString());
    if (params.availability && params.availability !== "all") {
      searchParams.set("availability", params.availability);
    }
    if (params.tags) searchParams.set("tags", params.tags.join(","));
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

    return this.request<ProductsApiResponse>(endpoint);
  }

  async getProductBySlug(slug: string): Promise<ProductApiResponse> {
    return this.request<ProductApiResponse>(`/products/${slug}`);
  }

  async getRelatedProducts(
    categoryId: string,
    limit: number = 8,
  ): Promise<RelatedProductsApiResponse> {
    const searchParams = new URLSearchParams();
    searchParams.set("category", categoryId);
    searchParams.set("limit", limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/products/related?${queryString}`;

    return this.request<RelatedProductsApiResponse>(endpoint);
  }

  async getProductsByCategory(
    categoryId: string,
    params: Omit<FetchProductsParams, "category"> = {},
  ): Promise<ProductsApiResponse> {
    return this.getProducts({ ...params, category: categoryId });
  }

  async searchProducts(
    query: string,
    params: Omit<FetchProductsParams, "search"> = {},
  ): Promise<ProductsApiResponse> {
    return this.getProducts({ ...params, search: query });
  }

  async getProductsByBrand(
    brand: string,
    params: Omit<FetchProductsParams, "brand"> = {},
  ): Promise<ProductsApiResponse> {
    return this.getProducts({ ...params, brand });
  }

  async getProductsOnSale(
    params: FetchProductsParams = {},
  ): Promise<ProductsApiResponse> {
    return this.getProducts({ ...params, tags: ["sale"] });
  }

  async getNewProducts(
    params: FetchProductsParams = {},
  ): Promise<ProductsApiResponse> {
    return this.getProducts({
      ...params,
      tags: ["new"],
      sortBy: "created_at",
      sortOrder: "desc",
    });
  }

  async getPopularProducts(
    params: FetchProductsParams = {},
  ): Promise<ProductsApiResponse> {
    return this.getProducts({
      ...params,
      sortBy: "popularity",
      sortOrder: "desc",
    });
  }
}

export const productsApi = new ProductsApi();
