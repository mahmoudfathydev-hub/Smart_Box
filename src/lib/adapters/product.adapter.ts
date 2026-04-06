import { Product, ProductRow } from "@/types/product";

/**
 * Product Adapter
 * Transforms Supabase rows to UI Product types
 */
export const productAdapter = {
  /**
   * Map database row to UI Product type
   */
  mapProductRow(row: ProductRow): Product {
    // Handle images - parse from JSON string if needed
    let images: string[] = [];
    if (row.images_url) {
      try {
        const parsedImages =
          typeof row.images_url === "string" ? JSON.parse(row.images_url) : row.images_url;
        images = Array.isArray(parsedImages) ? parsedImages : [];
      } catch (error) {
        console.error("Error parsing images_url:", error);
        images = [];
      }
    }

    // Handle specs - convert from record to array
    let specs: Array<{ name: string; value: string }> = [];
    if (row.specs_en) {
      try {
        const specsRecord =
          typeof row.specs_en === "string" ? JSON.parse(row.specs_en) : row.specs_en;
        if (typeof specsRecord === "object" && specsRecord !== null) {
          specs = Object.entries(specsRecord).map(([name, value]) => ({
            name,
            value: String(value),
          }));
        }
      } catch (error) {
        console.error("Error parsing specs_en:", error);
      }
    }

    // Calculate discount price if discount percentage exists
    const discountPrice =
      row.discount && row.discount > 0 ? row.price - (row.price * row.discount) / 100 : undefined;

    // Get localized name and description (preserve both for UI)
    const name_en = row.name_en || "";
    const name_ar = row.name_ar || "";
    const description_en = row.description_en || "";
    const description_ar = row.description_ar || "";
    const category_en = row.category_en || "";
    const category_ar = row.category_ar || "";
    const brand_en = row.brand_en || "";
    const brand_ar = row.brand_ar || "";

    return {
      id: row.id.toString(),
      name: name_en,
      name_en,
      name_ar,
      description: description_en,
      description_en,
      description_ar,
      price: row.price,
      images,
      slug: row.slug || `product-${row.id}`,
      category: category_en,
      category_en,
      category_ar,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      stockQuantity: row.stock,
      discountPrice,
      currency: row.currency || "USD",
      rating: row.rating || 0,
      brand: brand_en,
      brand_en,
      brand_ar,
      sku: row.sku,
      isActive: row.is_active !== false,
      tags: row.tags || [],
      weight: row.weight,
      dimensions: row.dimensions,
      specs,
    };
  },

  /**
   * Map multiple rows to Product types
   */
  mapProductRows(rows: ProductRow[]): Product[] {
    return rows.map((row) => this.mapProductRow(row));
  },

  /**
   * Map UI Product to database row (for create/update operations)
   */
  mapProductToRow(product: Partial<Product>): Partial<ProductRow> {
    return {
      name_en: product.name,
      name_ar: product.name,
      description_en: product.description,
      description_ar: product.description,
      category_en: product.category,
      category_ar: product.category,
      brand_en: product.brand,
      brand_ar: product.brand,
      price: product.price,
      stock: product.stockQuantity,
      sku: product.sku,
      slug: product.slug,
      is_active: product.isActive,
      rating: product.rating,
      currency: product.currency,
      tags: product.tags,
      weight: product.weight,
      dimensions: product.dimensions,
      specs_en: product.specs
        ? Object.fromEntries(product.specs.map((spec) => [spec.name, spec.value]))
        : undefined,
      images_url:
        product.images && product.images.length > 0 ? JSON.stringify(product.images) : undefined,
    };
  },
};
