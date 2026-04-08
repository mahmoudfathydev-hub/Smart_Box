# Database Architecture Refactoring Plan

---

# PHASE 1 - Audit Supabase Access Points

## Goal
Identify all direct Supabase access violations and categorize by severity

## Why this phase matters
Cannot fix architecture violations without complete inventory of current access patterns

## Tasks

### Task 1.1 - Find all Supabase imports
```bash
grep -r "import.*supabase\|createClient" src/
```

### Task 1.2 - Categorize violations
Create violation inventory table

### Task 1.3 - Assess severity
- **CRITICAL**: Client-side Supabase access (Redux, Components)
- **HIGH**: Service layer direct access
- **MEDIUM**: Duplicate access patterns
- **LOW**: Naming inconsistencies

## Expected Result
Complete violation inventory with fix priorities

## Violation Inventory

| File Path | Violation Type | Severity | Fix Required |
|-----------|----------------|----------|--------------|
| `/src/services/supabaseService.ts` | Service -> Supabase | HIGH | Move to repositories |
| `/src/lib/services/products.service.ts` | Service -> Supabase | HIGH | Remove direct access |
| `/src/redux/modules/addProduct/api.ts` | Redux -> Supabase | CRITICAL | Replace with server actions |
| `/src/redux/modules/addProduct/thunks.ts` | Redux -> Supabase | CRITICAL | Replace with server actions |
| `/src/lib/supabase.ts` | Infrastructure | LOW | Keep as client config |
| `/src/lib/repositories/product.repository.ts` | Repository -> Supabase | NONE | Correct pattern |
| `/src/lib/repositories/reviews.repository.ts` | Repository -> Supabase | NONE | Correct pattern |

---

# PHASE 2 - Fix Repository Layer

## Goal
Establish repository layer as single source of database communication

## Why this phase matters
Repository pattern is foundation for clean architecture and testability

## Tasks

### Task 2.1 - Create user.repository.ts
```typescript
// src/lib/repositories/user.repository.ts
import { supabase } from '@/lib/supabase';
import { UserAdapter } from '@/lib/adapters/user.adapter';

export class UserRepository {
  private static readonly TABLE_NAME = 'users';

  static async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? UserAdapter.mapRowToUser(data) : null;
  }

  static async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? UserAdapter.mapRowToUser(data) : null;
  }

  static async create(userData: Omit<UserRow, 'id' | 'created_at'>): Promise<User> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return UserAdapter.mapRowToUser(data);
  }

  static async update(id: string, updates: Partial<UserRow>): Promise<User> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return UserAdapter.mapRowToUser(data);
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
```

### Task 2.2 - Create employee.repository.ts
```typescript
// src/lib/repositories/employee.repository.ts
import { supabase } from '@/lib/supabase';
import { EmployeeAdapter } from '@/lib/adapters/employee.adapter';

export class EmployeeRepository {
  private static readonly TABLE_NAME = 'employees';

  static async getById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? EmployeeAdapter.mapRowToEmployee(data) : null;
  }

  static async getByEmail(email: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? EmployeeAdapter.mapRowToEmployee(data) : null;
  }

  static async create(employeeData: Omit<EmployeeRow, 'id' | 'created_at'>): Promise<Employee> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(employeeData)
      .select()
      .single();
    
    if (error) throw error;
    return EmployeeAdapter.mapRowToEmployee(data);
  }

  static async update(id: string, updates: Partial<EmployeeRow>): Promise<Employee> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return EmployeeAdapter.mapRowToEmployee(data);
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
```

### Task 2.3 - Create base.repository.ts
```typescript
// src/lib/repositories/base/base.repository.ts
import { supabase } from '@/lib/supabase';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  protected async getById(id: string | number): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  protected async getAll(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ data: T[]; count: number }> {
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
    
    let query = supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' });

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    
    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  protected async create(item: Omit<T, 'id' | 'created_at'>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  protected async update(id: string | number, updates: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  protected async delete(id: string | number): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
```

### Task 2.4 - Remove supabaseService.ts
Move all logic to appropriate repositories and delete original file

## Expected Result
Complete repository layer with consistent patterns and no duplicate logic

## Example Code Structure
```
src/lib/repositories/
  base/
    base.repository.ts
  product.repository.ts
  review.repository.ts
  user.repository.ts
  employee.repository.ts
```

---

# PHASE 3 - Refactor Service Layer

## Goal
Services contain business logic only, no direct database access

## Why this phase matters
Clean separation between data access and business rules

## Tasks

### Task 3.1 - Refactor products.service.ts
```typescript
// src/lib/services/products.service.ts
import { ProductRepository } from '@/lib/repositories/product.repository';
import { ReviewsRepository } from '@/lib/repositories/reviews.repository';
import { Product, ProductDetails } from '@/types/product';

export class ProductsService {
  // Business logic: Get product with all related data
  static async getProductDetails(slug: string): Promise<ProductDetails | null> {
    const [product, reviews, relatedProducts] = await Promise.all([
      ProductRepository.getBySlug(slug),
      ReviewsRepository.getProductRating(slug),
      ProductRepository.getRelatedProducts(slug)
    ]);

    if (!product) return null;

    return {
      ...product,
      averageRating: reviews.average,
      reviewCount: reviews.count,
      relatedProducts
    };
  }

  // Business logic: Get publicly visible products only
  static async getPublicProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    const filteredParams = {
      ...params,
      isActive: true, // Business rule: only active products
      stock_gt: 0     // Business rule: only in stock
    };

    return ProductRepository.getAllProducts(filteredParams);
  }

  // Business logic: Create product with validation and defaults
  static async createProduct(productData: Partial<Product>): Promise<Product> {
    // Business rule: Generate slug if not provided
    if (!productData.slug) {
      productData.slug = this.generateSlug(productData.name || '');
    }

    // Business rule: Set default currency
    if (!productData.currency) {
      productData.currency = 'USD';
    }

    // Business rule: Ensure required fields
    if (!productData.name || !productData.price) {
      throw new Error('Product name and price are required');
    }

    return ProductRepository.create(productData);
  }

  // Business logic: Slug generation
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Business logic: Product visibility rules
  static async getVisibleProducts(userRole?: string): Promise<ProductsResponse> {
    const params: ProductQueryParams = {
      isActive: true
    };

    // Business rule: Admins see inactive products
    if (userRole === 'admin') {
      delete params.isActive;
    }

    return ProductRepository.getAllProducts(params);
  }

  // Business logic: Price calculation with discounts
  static calculateDiscountedPrice(product: Product): number {
    if (product.discountPrice) {
      return product.discountPrice;
    }
    
    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount) / 100;
    }

    return product.price;
  }
}
```

### Task 3.2 - Create auth.service.ts
```typescript
// src/lib/services/auth.service.ts
import bcrypt from 'bcryptjs';
import { UserRepository } from '@/lib/repositories/user.repository';
import { EmployeeRepository } from '@/lib/repositories/employee.repository';
import { User, Employee } from '@/types/auth';

export class AuthService {
  // Business logic: User registration with validation
  static async registerUser(userData: {
    name: string;
    email: string;
    password: string;
    number: string;
    country: string;
    countryCode: string;
    role: 'user' | 'admin' | 'employee';
    accessKey?: string;
  }): Promise<User> {
    // Business rule: Validate access key for admin/employee
    if ((userData.role === 'admin' || userData.role === 'employee')) {
      if (!this.validateAccessKey(userData.role, userData.accessKey)) {
        throw new Error('Invalid access key for selected role');
      }
    }

    // Business rule: Check if user already exists
    const existingUser = await UserRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Business rule: Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const userToCreate = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      number: userData.number,
      country: userData.country,
      countryCode: userData.countryCode,
      role: userData.role,
      image_url: null
    };

    return UserRepository.create(userToCreate);
  }

  // Business logic: User authentication
  static async authenticateUser(email: string, password: string): Promise<User> {
    const user = await UserRepository.getByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Business rule: Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Business logic: Access key validation
  private static validateAccessKey(role: string, accessKey?: string): boolean {
    const ACCESS_KEYS = {
      admin: 'Admin12345',
      employee: 'employee12345'
    };

    return accessKey === ACCESS_KEYS[role as keyof typeof ACCESS_KEYS];
  }

  // Business logic: Permission checking
  static hasPermission(user: User | Employee, requiredRole: string): boolean {
    const roleHierarchy = {
      user: 0,
      employee: 1,
      admin: 2
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}
```

### Task 3.3 - Remove direct supabase imports from all services
Audit and remove all supabase imports from service files

## Expected Result
Clean service layer with only business logic, no database access

---

# PHASE 4 - Fix Redux Architecture

## Goal
Redux does NOT communicate with Supabase directly

## Why this phase matters
Prevents client-side database access and maintains architecture integrity

## Tasks

### Task 4.1 - Remove supabase imports from Redux modules
```typescript
// BEFORE: src/redux/modules/addProduct/api.ts
import { createClient } from "@supabase/supabase-js"; // REMOVE

// AFTER: src/redux/modules/addProduct/api.ts
// No supabase imports
```

### Task 4.2 - Replace Redux API calls with server actions
```typescript
// src/redux/modules/addProduct/api.ts
export const createProductInSupabase = async (
  product: Omit<Product, "id" | "created_at">,
) => {
  const response = await fetch('/api/products/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  const response = await fetch('/api/products/list');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};
```

### Task 4.3 - Update Redux thunks to use new API
```typescript
// src/redux/modules/addProduct/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadImageToCloudinary,
  createProductInSupabase,
  fetchProductsFromSupabase,
} from "./api";

export const createProduct = createAsyncThunk(
  "addProduct/createProduct",
  async (product: Omit<Product, "id" | "created_at">) => {
    const data = await createProductInSupabase(product);
    return data;
  },
);

export const fetchProducts = createAsyncThunk(
  "addProduct/fetchProducts",
  async () => {
    const data = await fetchProductsFromSupabase();
    return data;
  },
);
```

### Task 4.4 - Create API routes for Redux
```typescript
// src/app/api/products/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ProductsService } from "@/lib/services/products.service";
import { validateProductCreate } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = validateProductCreate(body);
    
    const product = await ProductsService.createProduct(validatedData);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 400 }
    );
  }
}
```

```typescript
// src/app/api/products/list/route.ts
import { NextResponse } from "next/server";
import { ProductsService } from "@/lib/services/products.service";

export async function GET() {
  try {
    const result = await ProductsService.getPublicProducts();
    return NextResponse.json(result.products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
```

## Expected Result
Redux layer only communicates with API endpoints, no direct database access

---

# PHASE 5 - Convert API Routes to Server Actions (Next 16)

## Goal
Use Server Actions for mutations instead of API routes where appropriate

## Why this phase matters
Server Actions are more efficient for mutations and align with Next.js 16 patterns

## Tasks

### Task 5.1 - Create server actions directory structure
```
src/app/server-actions/
  products/
    createProduct.ts
    updateProduct.ts
    deleteProduct.ts
  auth/
    registerUser.ts
    authenticateUser.ts
  reviews/
    submitReview.ts
    submitReply.ts
```

### Task 5.2 - Convert product creation to server action
```typescript
// src/app/server-actions/products/createProduct.ts
'use server';

import { revalidatePath } from 'next/cache';
import { ProductsService } from '@/lib/services/products.service';
import { validateProductCreate } from '@/lib/validation/schemas';

export async function createProduct(productData: Partial<Product>) {
  try {
    // Server-side validation
    const validatedData = validateProductCreate(productData);
    
    // Business logic
    const product = await ProductsService.createProduct(validatedData);
    
    // Revalidate relevant pages
    revalidatePath('/products');
    revalidatePath('/dashboard');
    
    return { success: true, product };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create product' 
    };
  }
}
```

### Task 5.3 - Convert review submission to server action
```typescript
// src/app/server-actions/reviews/submitReview.ts
'use server';

import { revalidatePath } from 'next/cache';
import { ReviewsService } from '@/lib/services/reviews.service';
import { validateReviewSubmit } from '@/lib/validation/schemas';

export async function submitReview(
  productSlug: string,
  reviewData: ReviewFormData,
  userId?: string
) {
  try {
    // Server-side validation
    const validatedData = validateReviewSubmit(reviewData);
    
    // Business logic
    const result = await ReviewsService.submitReview(productSlug, validatedData, userId);
    
    // Revalidate product page
    revalidatePath(`/products/${productSlug}`);
    
    return result;
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit review' 
    };
  }
}
```

### Task 5.4 - Update client components to use server actions
```typescript
// Example usage in client component
import { createProduct } from '@/app/server-actions/products/createProduct';

export default function ProductForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createProduct({
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      // ... other fields
    });

    if (result.success) {
      // Handle success
    } else {
      // Handle error
    }
  };

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Expected Result
Mutations use Server Actions, reducing API route complexity

---

# PHASE 6 - Standardize Adapter Layer

## Goal
DB models isolated from UI models with consistent adapters

## Why this phase matters
Prevents database schema changes from breaking UI components

## Tasks

### Task 6.1 - Create user.adapter.ts
```typescript
// src/lib/adapters/user.adapter.ts
import { User, UserRow } from '@/types/user';

export const userAdapter = {
  mapRowToUser(row: UserRow): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      number: row.number,
      country: row.country,
      countryCode: row.countryCode,
      imageUrl: row.image_url,
      role: row.role,
      createdAt: row.created_at,
      // Password never exposed to UI
    };
  },

  mapUserToRow(user: Partial<User>): Partial<UserRow> {
    return {
      name: user.name,
      email: user.email,
      number: user.number,
      country: user.country,
      countryCode: user.countryCode,
      image_url: user.imageUrl,
      role: user.role,
    };
  },
};
```

### Task 6.2 - Create employee.adapter.ts
```typescript
// src/lib/adapters/employee.adapter.ts
import { Employee, EmployeeRow } from '@/types/employee';

export const employeeAdapter = {
  mapRowToEmployee(row: EmployeeRow): Employee {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image,
      salary: row.salary,
      department: row.department,
      jobTitle: row.job_title,
      workSchedule: row.work_schedule,
      createdAt: row.created_at,
    };
  },

  mapEmployeeToRow(employee: Partial<Employee>): Partial<EmployeeRow> {
    return {
      name: employee.name,
      email: employee.email,
      image: employee.image,
      salary: employee.salary,
      department: employee.department,
      job_title: employee.jobTitle,
      work_schedule: employee.workSchedule,
    };
  },
};
```

### Task 6.3 - Enhance product.adapter.ts
```typescript
// src/lib/adapters/product.adapter.ts (enhanced)
import { Product, ProductRow, ProductImage } from "@/types/product";

export const productAdapter = {
  mapProductRow(row: ProductRow): Product {
    // Image handling
    const images = this.parseImages(row.images_url);
    
    // Specs handling
    const specs = this.parseSpecs(row.specs_en);
    
    // Price calculation
    const discountPrice = this.calculateDiscountPrice(row.price, row.discount);
    
    // Slug generation (moved from service)
    const slug = this.generateSlug(row.name_en, row.id);

    return {
      id: row.id.toString(),
      name: row.name_en || `Product ${row.id}`,
      name_en: row.name_en,
      name_ar: row.name_ar,
      description: row.description_en,
      description_en: row.description_en,
      description_ar: row.description_ar,
      price: row.price,
      discountPrice,
      currency: row.currency || "USD",
      images,
      slug,
      category: row.category_en,
      category_en: row.category_en,
      category_ar: row.category_ar,
      brand: row.brand_en,
      brand_en: row.brand_en,
      brand_ar: row.brand_ar,
      stockQuantity: row.stock,
      sku: row.sku,
      isActive: row.is_active !== false,
      tags: row.tags || [],
      weight: row.weight,
      dimensions: row.dimensions,
      specs,
      rating: 0, // Calculated separately
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    };
  },

  parseImages(imagesUrl: string | null): ProductImage[] {
    if (!imagesUrl) return [];
    
    try {
      const parsed = typeof imagesUrl === "string" ? JSON.parse(imagesUrl) : imagesUrl;
      const imageStrings = Array.isArray(parsed) ? parsed : [];
      
      return imageStrings.map((url: string, index: number) => ({
        id: `img-${index}`,
        url,
        alt: `Product image ${index + 1}`,
        order: index,
      }));
    } catch (error) {
      console.error("Error parsing images_url:", error);
      return [];
    }
  },

  parseSpecs(specsEn: Record<string, string> | string | null): Array<{ name: string; value: string }> {
    if (!specsEn) return [];
    
    try {
      const specsRecord = typeof specsEn === "string" ? JSON.parse(specsEn) : specsEn;
      if (typeof specsRecord === "object" && specsRecord !== null) {
        return Object.entries(specsRecord).map(([name, value]) => ({
          name,
          value: String(value),
        }));
      }
    } catch (error) {
      console.error("Error parsing specs_en:", error);
    }
    
    return [];
  },

  calculateDiscountPrice(price: number, discount?: number): number | undefined {
    return discount && discount > 0 ? price - (price * discount) / 100 : undefined;
  },

  generateSlug(name: string, id: number): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() || `product-${id}`;
  },

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
      is_active: product.isActive,
      currency: product.currency,
      tags: product.tags,
      weight: product.weight,
      dimensions: product.dimensions,
      specs_en: product.specs
        ? Object.fromEntries(product.specs.map((spec) => [spec.name, spec.value]))
        : undefined,
      images_url: product.images && product.images.length > 0
        ? JSON.stringify(product.images.map((img) => img.url))
        : undefined,
    };
  },
};
```

### Task 6.4 - Update repositories to use adapters
Ensure all repositories use their respective adapters for data transformation

## Expected Result
Consistent adapter layer with all formatting logic centralized

---

# PHASE 7 - Centralize Validation

## Goal
Validation reusable and consistent across all layers

## Why this phase matters
Prevents inconsistent validation and security vulnerabilities

## Tasks

### Task 7.1 - Enhance validation schemas
```typescript
// src/lib/validation/schemas.ts (enhanced)
import { z } from "zod";

// User validation schemas
export const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  number: z.string().min(10).max(20),
  country: z.string().min(2).max(50),
  countryCode: z.string().min(2).max(5),
  role: z.enum(['user', 'admin', 'employee']),
  accessKey: z.string().optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Product validation schemas
export const productCreateSchema = z.object({
  name_en: z.string().trim().min(1).max(200),
  name_ar: z.string().trim().min(1).max(200),
  description_en: z.string().trim().min(10).max(2000),
  description_ar: z.string().trim().min(10).max(2000),
  category_en: z.string().trim().min(1).max(50),
  category_ar: z.string().trim().min(1).max(50),
  brand_en: z.string().trim().min(1).max(100),
  brand_ar: z.string().trim().min(1).max(100),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().int().min(0),
  currency: z.string().length(3).default("USD"),
  tags: z.array(z.string().trim().max(30)).default([]),
  sku: z.string().trim().max(50).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
});

// Review validation schemas
export const reviewSubmitSchema = z.object({
  userName: z.string().trim().min(2).max(50),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1000),
});

// Query validation schemas
export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(50).optional(),
  brand: z.string().trim().max(50).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  availability: z.enum(["in_stock", "out_of_stock", "all"]).optional(),
  tags: z.array(z.string().trim().max(30)).optional(),
  sortBy: z.enum(["name", "price", "rating", "created_at"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Validation helpers
export const validateProductCreate = (data: unknown) => {
  return productCreateSchema.parse(data);
};

export const validateUserCreate = (data: unknown) => {
  return userCreateSchema.parse(data);
};

export const validateUserLogin = (data: unknown) => {
  return userLoginSchema.parse(data);
};

export const validateReviewSubmit = (data: unknown) => {
  return reviewSubmitSchema.parse(data);
};

export const validateProductQuery = (data: unknown) => {
  return productQuerySchema.parse(data);
};
```

### Task 7.2 - Create validation middleware
```typescript
// src/lib/validation/middleware.ts
import { NextRequest } from 'next/server';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
      }
      throw error;
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (query: unknown) => {
    try {
      return schema.parse(query);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new Error(`Query validation failed: ${JSON.stringify(formattedErrors)}`);
      }
      throw error;
    }
  };
}
```

### Task 7.3 - Apply validation to all API routes
```typescript
// src/app/api/auth/signup/route.ts (updated)
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { validateRequest } from "@/lib/validation/middleware";
import { userCreateSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const validatedData = await validateRequest(userCreateSchema)(request);
    const user = await AuthService.registerUser(validatedData);
    
    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 400 }
    );
  }
}
```

## Expected Result
Consistent validation across all API routes and server actions

---

# PHASE 8 - Security Hardening

## Goal
Implement comprehensive security measures

## Why this phase matters
Protect against common web vulnerabilities and attacks

## Tasks

### Task 8.1 - Create rate limiter
```typescript
// src/lib/security/rateLimiter.ts
export class RateLimiter {
  private static store = new Map<string, { count: number; resetTime: number }>();
  private static readonly CLEANUP_INTERVAL = 60000; // 1 minute

  static limit(options: {
    windowMs: number;
    maxRequests: number;
    identifier: string;
  }): boolean {
    const { windowMs, maxRequests, identifier } = options;
    const now = Date.now();
    const resetTime = now + windowMs;

    // Clean up expired entries
    this.cleanup();

    const current = this.store.get(identifier);
    
    if (!current || now > current.resetTime) {
      this.store.set(identifier, { count: 1, resetTime });
      return true;
    }

    if (current.count >= maxRequests) {
      return false;
    }

    current.count++;
    return true;
  }

  private static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  static getMiddleware(options: { windowMs: number; maxRequests: number }) {
    return (request: NextRequest) => {
      const identifier = this.getIdentifier(request);
      
      if (!this.limit({ ...options, identifier })) {
        throw new Error('Rate limit exceeded');
      }
    };
  }

  private static getIdentifier(request: NextRequest): string {
    // Use IP address as identifier
    return request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  }
}
```

### Task 8.2 - Create auth guard
```typescript
// src/lib/security/authGuard.ts
import { AuthService } from '@/lib/services/auth.service';
import { NextRequest } from 'next/server';

export class AuthGuard {
  static async authenticate(request: NextRequest): Promise<User> {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token required');
    }

    const token = authHeader.substring(7);
    
    // For now, using simple token validation
    // In production, use JWT or session validation
    try {
      const payload = this.verifyToken(token);
      const user = await this.getUserFromToken(payload);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid authentication token');
    }
  }

  static async authorize(user: User, requiredRole: string): Promise<void> {
    if (!AuthService.hasPermission(user, requiredRole)) {
      throw new Error('Insufficient permissions');
    }
  }

  private static verifyToken(token: string): any {
    // Implement JWT verification or session validation
    // For now, simple decode (NOT SECURE FOR PRODUCTION)
    try {
      return JSON.parse(atob(token));
    } catch {
      throw new Error('Invalid token format');
    }
  }

  private static async getUserFromToken(payload: any): Promise<User | null> {
    // Implement user retrieval from token payload
    return null; // Placeholder
  }
}
```

### Task 8.3 - Input sanitization middleware
```typescript
// src/lib/security/sanitizer.ts
export class InputSanitizer {
  static sanitizeString(input: unknown): string | undefined {
    if (typeof input !== 'string') return undefined;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"\\]/g, '') // Remove quotes and backslashes
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(input: unknown): string | undefined {
    const sanitized = this.sanitizeString(input);
    if (!sanitized) return undefined;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized.toLowerCase() : undefined;
  }

  static sanitizeNumber(input: unknown): number | undefined {
    const num = Number(input);
    return isNaN(num) ? undefined : num;
  }

  static sanitizeArray(input: unknown): string[] {
    if (!Array.isArray(input)) return [];
    
    return input
      .filter(item => typeof item === 'string')
      .map(item => this.sanitizeString(item))
      .filter(Boolean) as string[];
  }

  static sanitizeObject(input: unknown): Record<string, any> {
    if (typeof input !== 'object' || input === null) return {};
    
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(input)) {
      if (typeof key === 'string' && key.match(/^[a-zA-Z0-9_]+$/)) {
        sanitized[key] = this.sanitizeValue(value);
      }
    }
    
    return sanitized;
  }

  private static sanitizeValue(value: unknown): any {
    if (typeof value === 'string') return this.sanitizeString(value);
    if (typeof value === 'number') return this.sanitizeNumber(value);
    if (Array.isArray(value)) return this.sanitizeArray(value);
    if (typeof value === 'object' && value !== null) return this.sanitizeObject(value);
    return undefined;
  }
}
```

### Task 8.4 - Apply security to API routes
```typescript
// src/app/api/auth/signup/route.ts (with security)
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { RateLimiter } from "@/lib/security/rateLimiter";
import { InputSanitizer } from "@/lib/security/sanitizer";
import { validateRequest } from "@/lib/validation/middleware";
import { userCreateSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    RateLimiter.getMiddleware({ windowMs: 900000, maxRequests: 5 })(request); // 5 requests per 15 minutes
    
    // Input validation and sanitization
    const validatedData = await validateRequest(userCreateSchema)(request);
    const sanitizedData = InputSanitizer.sanitizeObject(validatedData);
    
    // Business logic
    const user = await AuthService.registerUser(sanitizedData);
    
    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    // Don't expose detailed errors in production
    const message = process.env.NODE_ENV === 'production' 
      ? 'Registration failed' 
      : error instanceof Error ? error.message : 'Registration failed';
    
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
```

## Expected Result
Comprehensive security measures protecting against common attacks

---

# PHASE 9 - Optimize RSC Data Fetching

## Goal
Minimize client fetching and maximize server-side data loading

## Why this phase matters
Improves performance, SEO, and user experience

## Tasks

### Task 9.1 - Audit current data fetching patterns
Identify all client-side data fetching that could move to server-side

### Task 9.2 - Optimize product page data fetching
```typescript
// src/app/[locale]/products/[slug]/page.tsx (optimized)
import { notFound } from "next/navigation";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { ReviewsService } from "@/lib/services/reviews.service";
import { ProductsService } from "@/lib/services/products.service";
import ProductPageClient from "./components/ProductPageClient";

interface ProductPageProps {
  params: { locale: string; slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;

  try {
    // Single batch fetch for all product-related data
    const [productDetails, relatedProducts] = await Promise.all([
      ProductsService.getProductDetails(slug),
      ProductRepository.getRelatedProducts(
        await ProductRepository.getCategoryBySlug(slug),
        slug,
        8
      )
    ]);

    if (!productDetails) {
      notFound();
    }

    return (
      <ProductPageClient
        product={productDetails}
        relatedProducts={relatedProducts}
        locale={locale}
      />
    );
  } catch (error) {
    console.error("Failed to load product page:", error);
    notFound();
  }
}
```

### Task 9.3 - Create optimized data fetching hooks
```typescript
// src/lib/hooks/useServerData.ts
import { cache } from 'react';

// Cache expensive operations
export const getFeaturedProducts = cache(async () => {
  return ProductRepository.getFeaturedProducts(8);
});

export const getProductsByCategory = cache(async (category: string) => {
  return ProductRepository.getProductsByCategory(category, 12);
});

export const getProductReviews = cache(async (slug: string) => {
  return ReviewsService.getProductReviews(slug, { page: 1, limit: 10 });
});
```

### Task 9.4 - Implement pagination optimization
```typescript
// src/lib/services/products.service.ts (enhanced)
export class ProductsService {
  static async getPublicProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    // Validate and sanitize query parameters
    const validatedParams = validateProductQuery(params);
    
    // Apply business rules
    const filteredParams = {
      ...validatedParams,
      isActive: true,
      stock_gt: 0,
      // Optimize field selection for list views
      select: 'id,name_en,price,discount,currency,images_url,category_en,brand_en,stock,created_at'
    };

    return ProductRepository.getAllProducts(filteredParams);
  }

  static async getProductsWithPagination(
    page: number = 1,
    limit: number = 12
  ): Promise<ProductsResponse> {
    return this.getPublicProducts({ page, limit });
  }
}
```

### Task 9.5 - Remove duplicate client-side fetching
Audit and remove unnecessary useEffect data fetching in client components

## Expected Result
Optimized server-side data fetching with minimal client-side requests

---

# PHASE 10 - Remove Duplicate Logic

## Goal
Eliminate code duplication and consolidate shared logic

## Why this phase matters
Reduces maintenance burden and prevents inconsistencies

## Tasks

### Task 10.1 - Remove duplicate getProducts implementations
Delete `ProductsService.getProducts()` and standardize on `ProductRepository.getAllProducts()`

### Task 10.2 - Consolidate slug generation logic
Move all slug generation to adapter layer, remove from services

### Task 10.3 - Remove duplicate validation
Ensure all validation uses centralized schemas

### Task 10.4 - Consolidate DTO models
Create shared type definitions and remove duplicates

### Task 10.5 - Remove duplicate query logic
Create base repository class for common patterns

## Expected Result
Single source of truth for all business logic and data operations

---

# PHASE 11 - Final Architecture Structure

## Goal
Provide clean, scalable architecture structure

## Why this phase matters
Establishes foundation for future development and team scaling

## Final Structure

```
src/
lib/
  database/
    client.ts              # Supabase client configuration
    types.ts               # Database type definitions
  
  repositories/
    base/
      base.repository.ts   # Base repository with common patterns
    product.repository.ts  # Product data operations
    review.repository.ts   # Review data operations
    user.repository.ts     # User data operations
    employee.repository.ts # Employee data operations
  
  services/
    auth.service.ts        # Authentication business logic
    product.service.ts     # Product business logic
    review.service.ts      # Review business logic
  
  adapters/
    product.adapter.ts     # Product model mapping
    review.adapter.ts      # Review model mapping
    user.adapter.ts        # User model mapping
    employee.adapter.ts    # Employee model mapping
  
  validation/
    schemas.ts             # Zod validation schemas
    middleware.ts          # Validation middleware
  
  security/
    rateLimiter.ts         # Rate limiting
    authGuard.ts           # Authentication guard
    sanitizer.ts           # Input sanitization
  
  utils/
    cache.ts               # Caching utilities
    errors.ts              # Error handling
    constants.ts           # Application constants

app/
  [locale]/
    products/
      [slug]/
        page.tsx           # Server Component
        components/
          ProductPageClient.tsx
    dashboard/
      page.tsx             # Server Component
      components/
    
    server-actions/
      products/
        createProduct.ts    # Server actions
        updateProduct.ts
        deleteProduct.ts
      auth/
        registerUser.ts
        authenticateUser.ts
      reviews/
        submitReview.ts
        submitReply.ts
    
    api/
      auth/                # Essential API routes only
        signin/route.ts
        signup/route.ts
      products/
        list/route.ts       # For Redux/RTK Query

redux/
  modules/
    products/
      slice.ts            # Redux slice
      api.ts              # RTK Query (API calls only)
    auth/
      slice.ts
    ui/
      slice.ts

types/
  product.ts              # Shared type definitions
  user.ts
  review.ts
  auth.ts
  common.ts
```

## Why This Structure Scales

1. **Clear Separation of Concerns**
   - Each layer has single responsibility
   - Easy to test and maintain
   - New team members can understand quickly

2. **Database Abstraction**
   - Repository pattern isolates database changes
   - Adapters prevent schema changes from breaking UI
   - Easy to switch database providers

3. **Security First**
   - Centralized validation and sanitization
   - Rate limiting and auth guards
   - No direct database access from client

4. **Performance Optimized**
   - Server Components for data fetching
   - Server Actions for mutations
   - Caching strategies built-in

5. **Type Safety**
   - End-to-end TypeScript coverage
   - Shared type definitions
   - Validation schemas match types

---

# PHASE 12 - Refactoring Order

## Goal
Provide step-by-step execution plan

## Why this phase matters
Ensures safe, incremental refactoring without breaking functionality

## Execution Order

### Step 1 - Create Base Infrastructure
1. Create `src/lib/repositories/base/base.repository.ts`
2. Create `src/lib/adapters/user.adapter.ts`
3. Create `src/lib/adapters/employee.adapter.ts`
4. Update `src/lib/validation/schemas.ts` with user schemas

### Step 2 - Create Missing Repositories
1. Create `src/lib/repositories/user.repository.ts`
2. Create `src/lib/repositories/employee.repository.ts`
3. Test repositories work correctly

### Step 3 - Fix Service Layer
1. Update `src/lib/services/products.service.ts` - remove direct supabase access
2. Create `src/lib/services/auth.service.ts`
3. Update services to use repositories only

### Step 4 - Update API Routes
1. Update `src/app/api/auth/signup/route.ts` to use new auth service
2. Update `src/app/api/auth/signin/route.ts` to use new auth service
3. Add validation middleware to all routes

### Step 5 - Fix Redux Architecture
1. Remove supabase imports from `src/redux/modules/addProduct/api.ts`
2. Update API calls to use new endpoints
3. Create `src/app/api/products/list/route.ts`
4. Create `src/app/api/products/create/route.ts`

### Step 6 - Create Server Actions
1. Create `src/app/server-actions/` directory structure
2. Create product server actions
3. Create review server actions
4. Update client components to use server actions

### Step 7 - Add Security Layer
1. Create `src/lib/security/rateLimiter.ts`
2. Create `src/lib/security/authGuard.ts`
3. Create `src/lib/security/sanitizer.ts`
4. Apply security to all API routes

### Step 8 - Optimize Data Fetching
1. Update product page to use optimized fetching
2. Create cached data hooks
3. Remove duplicate client-side fetching
4. Implement pagination optimization

### Step 9 - Clean Up
1. Delete `src/services/supabaseService.ts`
2. Remove duplicate logic from services
3. Consolidate type definitions
4. Update imports throughout codebase

### Step 10 - Testing and Validation
1. Test all API routes
2. Test authentication flows
3. Test product CRUD operations
4. Test review functionality
5. Verify security measures work

### Step 11 - Documentation
1. Update README with new architecture
2. Create developer onboarding guide
3. Document API endpoints
4. Document server actions

### Step 12 - Performance Testing
1. Test page load speeds
2. Verify caching works
3. Test rate limiting
4. Monitor database query performance

## Critical Path Notes

- **Must complete Steps 1-3 before any other changes** - Foundation must be solid
- **Test each step before proceeding** - Prevents cascading failures
- **Keep backup of original files** - Rollback capability
- **Update imports incrementally** - Avoid breaking changes
- **Run tests after each major change** - Ensure functionality preserved

## Risk Mitigation

1. **Feature Flags**: Use feature flags for major changes
2. **Gradual Migration**: Migrate one module at a time
3. **Backwards Compatibility**: Keep old endpoints during transition
4. **Monitoring**: Add error monitoring during refactoring
5. **Rollback Plan**: Have quick rollback strategy for each step

This refactoring plan transforms the current architecture into a production-ready, scalable system following Next.js 16 best practices and clean architecture principles.
