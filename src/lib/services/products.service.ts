import { supabase, Database } from '@/lib/supabase'
import { Product } from '@/redux/modules/products/types'

type ProductRow = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']

export class ProductsService {
  // Convert database row to frontend Product type
  private static convertRowToProduct(row: ProductRow): Product {
    return {
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
      images: row.images || [],
      specs: row.specs || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active,
      tags: row.tags || undefined,
      sku: row.sku || undefined,
      weight: row.weight || undefined,
      dimensions: row.dimensions || undefined,
    }
  }

  // Get products with filtering and pagination
  static async getProducts(params: {
    page?: number
    limit?: number
    search?: string
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    rating?: number
    availability?: 'in_stock' | 'out_of_stock' | 'all'
    tags?: string[]
    sortBy?: 'name' | 'price' | 'rating' | 'created_at' | 'popularity'
    sortOrder?: 'asc' | 'desc'
  } = {}) {
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
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = params

    let query = supabase
      .from('Add_Products') // Updated table name from 'products' to 'Add_Products'
      .select('*', { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq('category_id', category)
    }

    if (brand) {
      query = query.ilike('brand', `%${brand}%`)
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice)
    }

    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice)
    }

    if (rating !== undefined) {
      query = query.gte('rating', rating)
    }

    if (availability && availability !== 'all') {
      if (availability === 'in_stock') {
        query = query.gt('stock_quantity', 0)
      } else {
        query = query.eq('stock_quantity', 0)
      }
    }

    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    const products = data.map(this.convertRowToProduct)

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      },
    }
  }

  // Get single product by slug
  static async getProductBySlug(slug: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return this.convertRowToProduct(data)
  }

  // Get related products by category
  static async getRelatedProducts(categoryId: string, limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .limit(limit)
      .order('rating', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`)
    }

    return data.map(this.convertRowToProduct)
  }

  // Get products by category
  static async getProductsByCategory(categoryId: string, params: Omit<Parameters<typeof this.getProducts>[0], 'category'> = {}) {
    return this.getProducts({ ...params, category: categoryId })
  }

  // Search products
  static async searchProducts(query: string, params: Omit<Parameters<typeof this.getProducts>[0], 'search'> = {}) {
    return this.getProducts({ ...params, search: query })
  }

  // Get products by brand
  static async getProductsByBrand(brand: string, params: Omit<Parameters<typeof this.getProducts>[0], 'brand'> = {}) {
    return this.getProducts({ ...params, brand })
  }

  // Get products on sale
  static async getProductsOnSale(params: Omit<Parameters<typeof this.getProducts>[0], 'tags'> = {}) {
    return this.getProducts({ ...params, tags: ['sale'] })
  }

  // Get new products
  static async getNewProducts(params: Omit<Parameters<typeof this.getProducts>[0], 'sortBy' | 'sortOrder'> = {}) {
    return this.getProducts({ ...params, sortBy: 'created_at', sortOrder: 'desc' })
  }

  // Get popular products
  static async getPopularProducts(params: Omit<Parameters<typeof this.getProducts>[0], 'sortBy' | 'sortOrder'> = {}) {
    return this.getProducts({ ...params, sortBy: 'rating', sortOrder: 'desc' })
  }
}
