import { supabase, Database } from "@/lib/supabase";
import { Product } from "@/redux/modules/products/types";

// Define the actual database row type based on the logs
type ProductRow = {
  id: number;
  created_at: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category_ar: string;
  category_en: string;
  brand_ar: string;
  brand_en: string;
  price: number;
  discount: number;
  stock: number;
  sku: string;
  images_url: string;
  specs_en: Record<string, string>;
  is_active: boolean;
  // Add other possible fields with optional types
  slug?: string;
  name?: string;
  description?: string;
  short_description?: string;
  brand?: string;
  category_id?: string;
  discount_price?: number | null;
  currency?: string;
  rating?: number;
  stock_quantity?: number;
  images?: any;
  specs?: any;
  updated_at?: string;
  tags?: any;
  weight?: number;
  dimensions?: any;
};

export class ProductsService {
  // Convert database row to frontend Product type
  private static convertRowToProduct(row: ProductRow): Product {
    // Handle the actual database structure with name_en/name_ar, etc.
    const name = row.name_en || row.name || "";
    const description = row.description_en || row.description || "";
    const brand = row.brand_en || row.brand || "";
    const category = row.category_en || "";

    // Parse images_url if it's a string, otherwise use images array
    let images: Product["images"] = [];
    if (row.images_url) {
      try {
        const parsedImages =
          typeof row.images_url === "string" ? JSON.parse(row.images_url) : row.images_url;

        images = (Array.isArray(parsedImages) ? parsedImages : []).map(
          (url: string, index: number) => ({
            id: `img-${index}`,
            url,
            alt: `${name} - Image ${index + 1}`,
            order: index,
          }),
        );
      } catch (error) {
        console.error("Error parsing images_url:", error);
      }
    } else if (row.images && Array.isArray(row.images)) {
      images = row.images.map((url: string, index: number) => ({
        id: `img-${index}`,
        url,
        alt: `${name} - Image ${index + 1}`,
        order: index,
      }));
    }

    // Parse specs if it's a string, otherwise use specs array
    let specs: Product["specs"] = [];
    if (row.specs_en) {
      try {
        const parsedSpecs =
          typeof row.specs_en === "string" ? JSON.parse(row.specs_en) : row.specs_en;

        if (typeof parsedSpecs === "object" && parsedSpecs !== null) {
          specs = Object.entries(parsedSpecs).map(([key, value], index: number) => ({
            id: `spec-${index}`,
            name: key,
            value: String(value),
          }));
        }
      } catch (error) {
        console.error("Error parsing specs_en:", error);
      }
    } else if (row.specs && Array.isArray(row.specs)) {
      specs = row.specs.map((spec: any, index: number) => ({
        id: `spec-${index}`,
        name: spec.name || "",
        value: spec.value || "",
      }));
    }

    return {
      id: row.id.toString(),
      slug: row.slug || `product-${row.id}`,
      name,
      description,
      shortDescription: description.substring(0, 200),
      brand,
      categoryId: row.category_id || category,
      price: row.price || 0,
      discountPrice:
        row.discount_price ||
        (row.discount > 0 ? row.price - (row.price * row.discount) / 100 : undefined),
      currency: row.currency || "USD",
      rating: row.rating || 0,
      stockQuantity: row.stock_quantity || row.stock || 0,
      images,
      specs,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
      isActive: row.is_active !== false,
      tags: row.tags || [],
      sku: row.sku || undefined,
      weight: row.weight || undefined,
      dimensions: row.dimensions || undefined,
    };
  }

  // Get products with filtering and pagination
  static async getProducts(
    params: {
      page?: number;
      limit?: number;
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
    } = {},
  ) {
    console.log("=== PRODUCTS SERVICE DEBUG ===");
    console.log("getProducts called with params:", params);

    const {
      page = 1,
      limit = 12,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      availability,
      tags,
      sortBy = "created_at",
      sortOrder = "desc",
    } = params;

    // Check Supabase connection
    try {
      console.log("Testing Supabase connection...");
      const { data: testData, error: testError } = await supabase
        .from("Add_Products")
        .select("count")
        .limit(1);

      if (testError) {
        console.error("Supabase connection test failed:", testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      console.log("Supabase connection successful");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }

    let query = supabase
      .from("Add_Products") // Updated table name from 'products' to 'Add_Products'
      .select("*", { count: "exact" });

    console.log("Initial query built for table: Add_Products");

    // Apply filters
    if (search) {
      console.log("Applying search filter:", search);
      query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    if (category) {
      console.log("Applying category filter:", category);
      query = query.eq("category_id", category);
    }

    if (brand) {
      console.log("Applying brand filter:", brand);
      query = query.ilike("brand", `%${brand}%`);
    }

    if (minPrice !== undefined) {
      console.log("Applying minPrice filter:", minPrice);
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      console.log("Applying maxPrice filter:", maxPrice);
      query = query.lte("price", maxPrice);
    }

    if (rating !== undefined) {
      console.log("Applying rating filter:", rating);
      query = query.gte("rating", rating);
    }

    if (availability && availability !== "all") {
      console.log("Applying availability filter:", availability);
      if (availability === "in_stock") {
        query = query.gt("stock_quantity", 0);
      } else {
        query = query.eq("stock_quantity", 0);
      }
    }

    if (tags && tags.length > 0) {
      console.log("Applying tags filter:", tags);
      query = query.contains("tags", tags);
    }

    // Apply sorting
    console.log("Applying sorting:", { sortBy, sortOrder });
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    const offset = (page - 1) * limit;
    console.log("Applying pagination:", { page, limit, offset });
    query = query.range(offset, offset + limit - 1);

    console.log("Executing database query...");
    const { data, error, count } = await query;

    if (error) {
      console.error("Database query error:", error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    console.log("Database query successful:", {
      dataCount: data?.length || 0,
      totalCount: count,
      firstItem: data?.[0] || null,
    });

    const products = data.map(this.convertRowToProduct);

    const result = {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      },
    };

    console.log("Final result:", result);
    console.log("=== END PRODUCTS SERVICE DEBUG ===");

    return result;
  }

  // Get single product by slug
  static async getProductBySlug(slug: string): Promise<Product> {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return this.convertRowToProduct(data);
  }

  // Get related products by category
  static async getRelatedProducts(categoryId: string, limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .limit(limit)
      .order("rating", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }

    return data.map(this.convertRowToProduct);
  }

  // Get products by category
  static async getProductsByCategory(
    categoryId: string,
    params: Omit<Parameters<typeof this.getProducts>[0], "category"> = {},
  ) {
    return this.getProducts({ ...params, category: categoryId });
  }

  // Search products
  static async searchProducts(
    query: string,
    params: Omit<Parameters<typeof this.getProducts>[0], "search"> = {},
  ) {
    return this.getProducts({ ...params, search: query });
  }

  // Get products by brand
  static async getProductsByBrand(
    brand: string,
    params: Omit<Parameters<typeof this.getProducts>[0], "brand"> = {},
  ) {
    return this.getProducts({ ...params, brand });
  }

  // Get products on sale
  static async getProductsOnSale(
    params: Omit<Parameters<typeof this.getProducts>[0], "tags"> = {},
  ) {
    return this.getProducts({ ...params, tags: ["sale"] });
  }

  // Get new products
  static async getNewProducts(
    params: Omit<Parameters<typeof this.getProducts>[0], "sortBy" | "sortOrder"> = {},
  ) {
    return this.getProducts({
      ...params,
      sortBy: "created_at",
      sortOrder: "desc",
    });
  }

  // Get popular products
  static async getPopularProducts(
    params: Omit<Parameters<typeof this.getProducts>[0], "sortBy" | "sortOrder"> = {},
  ) {
    return this.getProducts({ ...params, sortBy: "rating", sortOrder: "desc" });
  }
}
