import { Accessory, AccessoryRow, AccessoryImage } from "@/types/accessory";

/**
 * Accessory Adapter
 * Transforms Supabase rows to UI Accessory types
 */
export const accessoryAdapter = {
  /**
   * Map database row to UI Accessory type
   */
  mapAccessoryRow(row: AccessoryRow): Accessory {
    // Handle images - convert single image_url to AccessoryImage array
    let images: AccessoryImage[] = [];
    if (row.image_url) {
      images = [
        {
          id: `img-0`,
          url: row.image_url,
          alt: `${row.name_en || "Accessory"} image 1`,
          order: 0,
        },
      ];
    }

    // Calculate discount price if discount percentage exists
    const discountPrice =
      row.discount && row.discount > 0 ? row.price - (row.price * row.discount) / 100 : undefined;

    // Get localized name and description (preserve undefined for fallback logic)
    const name_en = row.name_en || undefined;
    const name_ar = row.name_ar || undefined;
    const description_en = row.description_en || undefined;
    const description_ar = row.description_ar || undefined;

    // Generate slug from name_en (as requested)
    const slug = name_en
      ? name_en
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      : `accessory-${row.id}`;

    return {
      id: row.id.toString(),
      name: name_en || `Accessory ${row.id}`,
      name_en,
      name_ar,
      description: description_en,
      description_en,
      description_ar,
      price: row.price,
      discountPrice,
      image_url: row.image_url,
      slug,
      type: row.type,
      brand: row.brand,
      sku: row.sku,
      status: row.status,
      discount: row.discount,
      stock_quantity: row.stock_quantity,
      compatible_devices: row.compatible_devices || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      currency: row.currency || "USD",
      rating: 0, // Default to 0 since rating is calculated from reviews, not stored in DB
      tags: row.tags || [],
      weight: row.weight,
      dimensions: row.dimensions,
      specs: [], // Accessories don't have specs in database structure
    };
  },

  /**
   * Map multiple rows to Accessory types
   */
  mapAccessoryRows(rows: AccessoryRow[]): Accessory[] {
    return rows.map((row) => this.mapAccessoryRow(row));
  },

  /**
   * Map UI Accessory to database row (for create/update operations)
   */
  mapAccessoryToRow(accessory: Partial<Accessory>): Partial<AccessoryRow> {
    return {
      name_en: accessory.name,
      name_ar: accessory.name,
      description_en: accessory.description,
      description_ar: accessory.description,
      type: accessory.type,
      brand: accessory.brand,
      price: accessory.price,
      sku: accessory.sku,
      status: accessory.status,
      discount: accessory.discount,
      stock_quantity: accessory.stock_quantity,
      compatible_devices: accessory.compatible_devices,
      image_url: accessory.image_url,
      currency: accessory.currency,
      tags: accessory.tags,
      weight: accessory.weight,
      dimensions: accessory.dimensions,
    };
  },
};
