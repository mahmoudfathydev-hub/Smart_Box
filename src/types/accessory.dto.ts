/**
 * Accessory DTO Types
 * Clean Architecture: Data Transfer Objects for API layer
 */

export interface AccessoryDTO {
  id: number;
  name: string;
  price: number;
  type: string;
  brand: string;
  stockQuantity: number;
  description: string;
  imageUrl: string;
  compatibleDevices: string;
  status: string;
  discount: string;
  sku: string;
}

/**
 * Adapter function to convert DB row to DTO safely
 */
export function mapAccessoryRow(row: {
  id: number;
  created_at: string;
  name_en: string | null;
  name_ar: string | null;
  price: number | null;
  type: string | null;
  brand: string | null;
  stock_quantity: number | null;
  description_en: string | null;
  description_ar: string | null;
  image_url: string | null;
  compatible_devices: string | null;
  status: string | null;
  discount: string | null;
  sku: string | null;
}): AccessoryDTO {
  return {
    id: row.id,
    name: row.name_en ?? row.name_ar ?? "",
    price: row.price ?? 0,
    type: row.type ?? "",
    brand: row.brand ?? "",
    stockQuantity: row.stock_quantity ?? 0,
    description: row.description_en ?? row.description_ar ?? "",
    imageUrl: row.image_url ?? "",
    compatibleDevices: row.compatible_devices ?? "",
    status: row.status ?? "active",
    discount: row.discount ?? "0",
    sku: row.sku ?? ""
  };
}
