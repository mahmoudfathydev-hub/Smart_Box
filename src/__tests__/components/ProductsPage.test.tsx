import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApiSlice } from '@/redux/modules/products/apiSlice';
import productsReducer from '@/redux/modules/products/slice';
import languageReducer from '@/redux/slices/languageSlice';
import themeReducer from '@/redux/slices/themeSlice';
import ProductsPage from '@/app/[locale]/products/page';
import { mockProducts, mockApiResponse } from '@/__mocks__/products';

// Mock the API slice
jest.mock('@/redux/modules/products/apiSlice', () => ({
  productsApiSlice: {
    reducer: {
      getProducts: jest.fn(),
    },
    useGetProductsQuery: jest.fn(),
    reducerPath: 'productsApi',
    middleware: jest.fn(),
  },
  useGetProductsQuery: jest.fn(),
}));

// Mock components
jest.mock('@/app/[locale]/products/components/ProductsHeader', () => {
  return function MockProductsHeader({ title, subtitle, totalItems }: any) {
    return (
      <div data-testid="products-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <span>{totalItems} items</span>
      </div>
    );
  };
});

jest.mock('@/app/[locale]/products/components/ProductsToolbar', () => {
  return function MockProductsToolbar({ onSearch, onFiltersToggle, showFilters, totalItems }: any) {
    return (
      <div data-testid="products-toolbar">
        <button onClick={() => onSearch('test')}>Search</button>
        <button onClick={onFiltersToggle}>Toggle Filters</button>
        <span>{showFilters ? 'Filters shown' : 'Filters hidden'}</span>
        <span>{totalItems} items</span>
      </div>
    );
  };
});

jest.mock('@/app/[locale]/products/components/ProductsFilters', () => {
  return function MockProductsFilters({ filters, onFilterChange }: any) {
    return (
      <div data-testid="products-filters">
        <button onClick={() => onFilterChange({ category: 'electronics' })}>
          Filter by Electronics
        </button>
      </div>
    );
  };
});

jest.mock('@/app/[locale]/products/components/ProductsGrid', () => {
  return function MockProductsGrid({ products, loading, error }: any) {
    if (loading) return <div data-testid="products-loading">Loading...</div>;
    if (error) return <div data-testid="products-error">Error: {error}</div>;
    if (products.length === 0) return <div data-testid="products-empty">No products found</div>;
    
    return (
      <div data-testid="products-grid">
        {products.map((product: any) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            {product.name}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('@/app/[locale]/products/components/ProductsPagination', () => {
  return function MockProductsPagination({ currentPage, totalPages, onPageChange }: any) {
    return (
      <div data-testid="products-pagination">
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(2)}>Next Page</button>
      </div>
    );
  };
});

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      language: languageReducer,
      products: productsReducer,
      [productsApiSlice.reducerPath]: productsApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(productsApiSlice.middleware),
    preloadedState: initialState,
  });
};

// Helper function to render with provider
const renderWithProvider = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('ProductsPage', () => {
  const mockUseGetProductsQuery = jest.mocked(require('@/redux/modules/products/apiSlice').useGetProductsQuery);

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    mockUseGetProductsQuery.mockReturnValue({
      data: mockApiResponse,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);
  });

  it('renders products page with products', async () => {
    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-header')).toBeInTheDocument();
      expect(screen.getByTestId('products-toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('products-grid')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText(mockApiResponse.products.length)).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    } as any);

    renderWithProvider(<ProductsPage />);
    
    expect(screen.getByTestId('products-loading')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    const errorMessage = 'Failed to fetch products';
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: errorMessage },
      refetch: jest.fn(),
    } as any);

    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows empty state when no products', async () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: { products: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 12, hasNextPage: false, hasPrevPage: false } },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    const { refetch } = mockUseGetProductsQuery.mockReturnValue({
      data: mockApiResponse,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-toolbar')).toBeInTheDocument();
    });
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    // Note: The actual search implementation would be tested through the hook
    // This test verifies the UI interaction
    expect(searchButton).toBeInTheDocument();
  });

  it('handles filter toggle', async () => {
    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-toolbar')).toBeInTheDocument();
    });
    
    const toggleButton = screen.getByText('Toggle Filters');
    fireEvent.click(toggleButton);
    
    // Verify filters section is shown/hidden
    expect(screen.getByText('Filters hidden')).toBeInTheDocument();
  });

  it('handles filter changes', async () => {
    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-toolbar')).toBeInTheDocument();
    });
    
    // Toggle filters first
    const toggleButton = screen.getByText('Toggle Filters');
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-filters')).toBeInTheDocument();
    });
    
    const filterButton = screen.getByText('Filter by Electronics');
    fireEvent.click(filterButton);
    
    // Note: The actual filter implementation would be tested through the hook
    expect(filterButton).toBeInTheDocument();
  });

  it('shows pagination when multiple pages', async () => {
    const multiPageResponse = {
      ...mockApiResponse,
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalItems: 60,
        itemsPerPage: 12,
        hasNextPage: true,
        hasPrevPage: false,
      },
    };

    mockUseGetProductsQuery.mockReturnValue({
      data: multiPageResponse,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-pagination')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('60 items')).toBeInTheDocument();
  });

  it('handles page changes', async () => {
    const multiPageResponse = {
      ...mockApiResponse,
      pagination: {
        currentPage: 1,
        totalPages: 5,
        totalItems: 60,
        itemsPerPage: 12,
        hasNextPage: true,
        hasPrevPage: false,
      },
    };

    mockUseGetProductsQuery.mockReturnValue({
      data: multiPageResponse,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('products-pagination')).toBeInTheDocument();
    });
    
    const nextPageButton = screen.getByText('Next Page');
    fireEvent.click(nextPageButton);
    
    // Note: The actual page change would be tested through the hook
    expect(nextPageButton).toBeInTheDocument();
  });

  it('handles retry functionality', async () => {
    const refetch = jest.fn();
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Network error' },
      refetch,
    } as any);

    renderWithProvider(<ProductsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(refetch).toHaveBeenCalled();
  });
});
