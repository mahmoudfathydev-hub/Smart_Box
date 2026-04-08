export interface Accessory {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  type: string;
  brand_en: string;
  brand_ar: string;
  price: number;
  discount: number;
  stock_quantity: number;
  sku: string;
  image_url: string;
  compatible_devices: string[];
  is_active: boolean;
}

export interface AccessorySpecs {
  [key: string]: string;
}

export interface AddAccessoriesState {
  accessory: Accessory;
  accessories: Accessory[];
  loading: boolean;
  error: string | null;
  errors: Record<string, string>;
  success: boolean;
  uploadingImages: boolean;
  fetchingAccessories: boolean;
}
