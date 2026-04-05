import { z } from "zod";

export const productSchema = z.object({
  name_en: z.string().min(3, "Name (EN) must be at least 3 characters"),
  name_ar: z.string().min(3, "اسم المنتج (AR) يجب أن يكون 3 أحرف على الأقل"),
  description_en: z.string().min(10, "Description (EN) must be at least 10 characters"),
  description_ar: z.string().min(10, "وصف المنتج (AR) يجب أن يكون 10 أحرف على الأقل"),
  category_en: z.string().min(1, "Category (EN) is required"),
  category_ar: z.string().min(1, "الفئة (AR) مطلوبة"),
  brand_en: z.string().min(1, "Brand (EN) is required"),
  brand_ar: z.string().min(1, "الماركة (AR) مطلوبة"),
  price: z.number().positive("Price must be greater than 0"),
  discount: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%"),
  stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
  sku: z.string().min(1, "SKU is required"),
  images_url: z.array(z.string()).min(1, "At least one image is required").max(4, "Maximum 4 images allowed"),
  is_active: z.boolean().default(true),
  specs_en: z.record(z.string(), z.string()).optional(),
  specs_ar: z.record(z.string(), z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
