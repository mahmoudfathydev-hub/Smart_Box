import { z } from "zod";

export const accessorySchema = z.object({
  name_en: z.string().min(1, "Accessory name (EN) is required"),
  name_ar: z.string().min(1, "Accessory name (AR) is required"),
  description_en: z.string().min(1, "Description (EN) is required"),
  description_ar: z.string().min(1, "Description (AR) is required"),
  type: z.string().min(1, "Accessory type is required"),
  brand_en: z.string().min(1, "Brand (EN) is required"),
  brand_ar: z.string().min(1, "Brand (AR) is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
  stock_quantity: z.number().min(0, "Stock quantity must be greater than or equal to 0"),
  sku: z.string().optional(),
  image_url: z.string().optional(),
  compatible_devices: z.array(z.string()).optional(),
  is_active: z.boolean(),
});

export type AccessoryFormData = z.infer<typeof accessorySchema>;
