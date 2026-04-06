import { ProductsService } from '@/lib/services/products.service';
import { supabase } from '@/lib/supabase';
import { mockSupabaseResponse, mockProductRows } from '@/__mocks__/products';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        count: jest.fn(() => ({
          or: jest.fn(() => ({
            eq: jest.fn(() => ({
              ilike: jest.fn(() => ({
                gte: jest.fn(() => ({
                  lte: jest.fn(() => ({
                    gt: jest.fn(() => ({
                      contains: jest.fn(() => ({
                        order: jest.fn(() => ({
                          range: jest.fn(() => Promise.resolve(mockSupabaseResponse))
                        }))
                      }))
                    }))
                  }))
                }))
              }))
            }))
          }))
        }))
      }))
    }))
  },
}));

describe('ProductsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch products with default parameters', async () => {
      const result = await ProductsService.getProducts();

      expect(supabase.from).toHaveBeenCalledWith('Add_Products');
      expect(result).toEqual({
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
          })
        ]),
        pagination: {
          currentPage: 1,
          totalPages: expect.any(Number),
          totalItems: expect.any(Number),
          itemsPerPage: 12,
          hasNextPage: expect.any(Boolean),
          hasPreviousPage: false,
        }
      });
    });

    it('should fetch products with pagination parameters', async () => {
      const params = { page: 2, limit: 20 };
      const result = await ProductsService.getProducts(params);

      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.itemsPerPage).toBe(20);
    });

    it('should apply search filter', async () => {
      const searchQuery = 'laptop';
      const mockFrom = supabase.from as jest.MockedFunction<any>;
      
      await ProductsService.getProducts({ search: searchQuery });

      expect(mockFrom).toHaveBeenCalledWith('Add_Products');
      // Verify the or method was called with search parameters
      expect(mockFrom.mock.results[0].value.select.mock.results[0].value.count.or).toHaveBeenCalledWith(
        `name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`
      );
    });

    it('should apply category filter', async () => {
      const categoryId = 'electronics';
      await ProductsService.getProducts({ category: categoryId });

      const mockSelect = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select;
      expect(mockSelect.mock.results[0].value.count.or.mock.results[0].value.eq).toHaveBeenCalledWith('category_id', categoryId);
    });

    it('should apply brand filter', async () => {
      const brand = 'Apple';
      await ProductsService.getProducts({ brand: brand });

      const mockEq = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select.mock.results[0].value.count.or.mock.results[0].value;
      expect(mockEq.ilike).toHaveBeenCalledWith('brand', `%${brand}%`);
    });

    it('should apply price range filter', async () => {
      const minPrice = 100;
      const maxPrice = 1000;
      
      await ProductsService.getProducts({ minPrice, maxPrice });

      // Verify price filters are applied
      const mockIlike = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select.mock.results[0].value.count.or.mock.results[0].value.ilike.mock.results[0].value;
      expect(mockIlike.gte).toHaveBeenCalledWith('price', minPrice);
      expect(mockIlike.gte.mock.results[0].value.lte).toHaveBeenCalledWith('price', maxPrice);
    });

    it('should apply rating filter', async () => {
      const rating = 4;
      await ProductsService.getProducts({ rating });

      const mockLte = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select.mock.results[0].value.count.or.mock.results[0].value.ilike.mock.results[0].value.gte.mock.results[0].value;
      expect(mockLte.gte).toHaveBeenCalledWith('rating', rating);
    });

    it('should apply availability filter', async () => {
      await ProductsService.getProducts({ availability: 'in_stock' });

      const mockGte = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select.mock.results[0].value.count.or.mock.results[0].value.ilike.mock.results[0].value.gte.mock.results[0].value.lte.mock.results[0].value;
      expect(mockGte.gt).toHaveBeenCalledWith('stock_quantity', 0);
    });

    it('should apply out of stock filter', async () => {
      await ProductsService.getProducts({ availability: 'out_of_stock' });

      const mockGt = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select.mock.results[0].value.count.or.mock.results[0].value.ilike.mock.results[0].value.gte.mock.results[0].value.lte.mock.results[0].value.gt.mock.results[0].value;
      expect(mockGt.eq).toHaveBeenCalledWith('stock_quantity', 0);
    });

    it('should apply tags filter', async () => {
      const tags = ['new', 'sale'];
      await ProductsService.getProducts({ tags });

      const mockEq = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select.mock.results[0].value.count.or.mock.results[0].value.ilike.mock.results[0].value.gte.mock.results[0].value.lte.mock.results[0].value.gt.mock.results[0].value.eq.mock.results[0].value;
      expect(mockEq.contains).toHaveBeenCalledWith('tags', tags);
    });

    it('should apply sorting', async () => {
      const sortBy = 'price';
      const sortOrder = 'asc';
      
      await ProductsService.getProducts({ sortBy, sortOrder });

      const mockContains = (supabase.from as jest.MockedFunction<any>).mock.results[0].value.select.mock.results[0].value.count.or.mock.results[0].value.ilike.mock.results[0].value.gte.mock.results[0].value.lte.mock.results[0].value.gt.mock.results[0].value.eq.mock.results[0].value.contains.mock.results[0].value;
      expect(mockContains.order).toHaveBeenCalledWith(sortBy, { ascending: sortOrder === 'asc' });
    });

    it('should handle database errors', async () => {
      const errorMessage = 'Database connection failed';
      
      // Mock Supabase to return an error
      (supabase.from as jest.MockedFunction<any>).mockReturnValueOnce({
        select: jest.fn(() => ({
          count: jest.fn(() => ({
            or: jest.fn(() => ({
              eq: jest.fn(() => ({
                ilike: jest.fn(() => ({
                  gte: jest.fn(() => ({
                    lte: jest.fn(() => ({
                      gt: jest.fn(() => ({
                        contains: jest.fn(() => ({
                          order: jest.fn(() => ({
                            range: jest.fn(() => Promise.resolve({
                              data: null,
                              error: { message: errorMessage }
                            }))
                          }))
                        }))
                      }))
                    }))
                  }))
                }))
              }))
            }))
          }))
        }))
      });

      await expect(ProductsService.getProducts()).rejects.toThrow(`Failed to fetch products: ${errorMessage}`);
    });

    it('should convert database rows to product format', async () => {
      const result = await ProductsService.getProducts();

      expect(result.products).toHaveLength(mockProductRows.length);
      
      // Check if first product is properly converted
      const firstProduct = result.products[0];
      const firstRow = mockProductRows[0];
      
      expect(firstProduct.id).toBe(firstRow.id);
      expect(firstProduct.name).toBe(firstRow.name);
      expect(firstProduct.price).toBe(firstRow.price);
      expect(firstProduct.shortDescription).toBe(firstRow.short_description);
      expect(firstProduct.categoryId).toBe(firstRow.category_id);
      expect(firstProduct.discountPrice).toBe(firstRow.discount_price);
      expect(firstProduct.stockQuantity).toBe(firstRow.stock_quantity);
      expect(firstProduct.createdAt).toBe(firstRow.created_at);
      expect(firstProduct.updatedAt).toBe(firstRow.updated_at);
      expect(firstProduct.isActive).toBe(firstRow.is_active);
    });
  });

  describe('getProductBySlug', () => {
    it('should fetch a single product by slug', async () => {
      const slug = 'test-product-1';
      
      // Mock the single product query
      (supabase.from as jest.MockedFunction<any>).mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: mockProductRows[0],
              error: null
            }))
          }))
        }))
      });

      const result = await ProductsService.getProductBySlug(slug);

      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(result).toEqual(expect.objectContaining({
        id: mockProductRows[0].id,
        name: mockProductRows[0].name,
        slug: mockProductRows[0].slug
      }));
    });

    it('should handle product not found', async () => {
      const slug = 'non-existent-product';
      
      (supabase.from as jest.MockedFunction<any>).mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Product not found' }
            }))
          }))
        }))
      });

      await expect(ProductsService.getProductBySlug(slug)).rejects.toThrow('Failed to fetch product: Product not found');
    });
  });

  describe('getRelatedProducts', () => {
    it('should fetch related products by category', async () => {
      const categoryId = 'electronics';
      const limit = 8;
      
      // Mock related products query
      (supabase.from as jest.MockedFunction<any>).mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              limit: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({
                  data: mockProductRows.slice(0, limit),
                  error: null
                }))
              }))
            }))
          }))
        }))
      });

      const result = await ProductsService.getRelatedProducts(categoryId, limit);

      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(result).toHaveLength(limit);
    });
  });

  describe('convenience methods', () => {
    it('should get products by category', async () => {
      const categoryId = 'electronics';
      const params = { page: 1, limit: 10 };
      
      await ProductsService.getProductsByCategory(categoryId, params);

      // Should call getProducts with category parameter
      expect(supabase.from).toHaveBeenCalledWith('Add_Products');
    });

    it('should search products', async () => {
      const query = 'laptop';
      const params = { page: 1, limit: 10 };
      
      await ProductsService.searchProducts(query, params);

      expect(supabase.from).toHaveBeenCalledWith('Add_Products');
    });

    it('should get products by brand', async () => {
      const brand = 'Apple';
      const params = { page: 1, limit: 10 };
      
      await ProductsService.getProductsByBrand(brand, params);

      expect(supabase.from).toHaveBeenCalledWith('Add_Products');
    });

    it('should get products on sale', async () => {
      const params = { page: 1, limit: 10 };
      
      await ProductsService.getProductsOnSale(params);

      expect(supabase.from).toHaveBeenCalledWith('Add_Products');
    });

    it('should get new products', async () => {
      const params = { page: 1, limit: 10 };
      
      await ProductsService.getNewProducts(params);

      expect(supabase.from).toHaveBeenCalledWith('Add_Products');
    });

    it('should get popular products', async () => {
      const params = { page: 1, limit: 10 };
      
      await ProductsService.getPopularProducts(params);

      expect(supabase.from).toHaveBeenCalledWith('Add_Products');
    });
  });
});
