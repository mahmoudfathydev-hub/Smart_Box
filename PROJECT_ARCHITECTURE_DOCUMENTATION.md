# Project Architecture Documentation

## Root Structure Overview

The Smartbox project follows a modern Next.js App Router architecture with TypeScript, implementing a scalable e-commerce platform with internationalization support. The architecture emphasizes separation of concerns, modular design, and maintainable code organization.

Key architectural principles:
- **App Router**: Utilizes Next.js 13+ App Router for improved routing and layout capabilities
- **Internationalization**: Built-in i18n support with locale-based routing
- **State Management**: Redux Toolkit for predictable state management
- **Component Organization**: Atomic design principles with reusable UI components
- **Type Safety**: Comprehensive TypeScript implementation throughout
- **API Integration**: RESTful API routes following Next.js conventions

---

## Folder: app/

### Purpose
The `app/` directory contains the core Next.js App Router structure, including pages, layouts, API routes, and server components. This is the heart of the application following the App Router conventions.

### Contains
- `[locale]/`: Internationalized routes for different languages
- `api/`: Server-side API endpoints
- `globals.css`: Global styles and Tailwind CSS setup
- `layout.tsx`: Root layout wrapper for the entire application

### Best Practices
- Keep API routes organized by resource type
- Use server components for data fetching when possible
- Implement proper error boundaries in layouts
- Maintain consistent folder structure for scalability

---

## File: app/layout.tsx

### Purpose
Root layout component that wraps the entire application, providing global providers, fonts, and HTML structure.

### Responsibilities
- Configure and apply global fonts (Geist Sans and Geist Mono)
- Set up global providers (Redux, Direction, Conditional Layout)
- Define HTML structure and metadata
- Apply global CSS and font variables

### Example Code
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import DirectionProvider from "@/components/providers/DirectionProvider";
import ConditionalLayout from "@/components/providers/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartBox",
  description: "SmartBox - Your Smart Shopping Destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <DirectionProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </DirectionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
```

### Dependencies
- `next`: Next.js framework
- `react`: React library
- `@/components/providers/*`: Custom provider components

### Relationship to Other Parts
- Wraps all pages and layouts in the application
- Provides Redux store to all components
- Manages text direction for internationalization
- Applies global styling and fonts

### Best Practices
- Keep root layout minimal and focused on global concerns
- Avoid adding complex logic or business rules
- Use semantic HTML elements
- Ensure proper meta tags for SEO

### Scalability Notes
- Easy to add new global providers
- Font configuration supports multiple locales
- Metadata can be dynamically generated based on route
- Supports theme switching and other global features

---

## File: middleware.ts

### Purpose
Next.js middleware that handles internationalization routing by automatically redirecting users to the appropriate locale-based URL.

### Responsibilities
- Detect user's preferred language or default to English
- Redirect requests without locale to locale-specific URLs
- Skip middleware for API routes, static files, and existing locale paths
- Configure route matching patterns

### Example Code
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if already has locale or is an API route or static files
  if (
    pathname.startsWith('/en') || 
    pathname.startsWith('/ar') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect to /en by default
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|en|ar).*)',
  ],
};
```

### Dependencies
- `next/server`: Next.js server utilities

### Relationship to Other Parts
- Works with `[locale]` dynamic routes
- Integrates with language enum definitions
- Supports the internationalization system

### Best Practices
- Keep middleware lightweight for performance
- Use specific matcher patterns to avoid unnecessary execution
- Handle edge cases for static assets and API routes
- Consider user preferences for language detection

### Scalability Notes
- Easy to add new supported locales
- Can be extended with user preference detection
- Supports A/B testing and feature flags
- Can integrate with analytics for locale tracking

---

## Folder: app/[locale]/

### Purpose
Dynamic locale-based routing structure that enables internationalization support for different languages (English and Arabic).

### Contains
- `components/`: Locale-specific page components
- `dashboard/`: Dashboard pages with internationalization
- `layout.tsx`: Locale-specific layout wrapper
- `page.tsx`: Home page for each locale
- `products/`: Product pages with localization

### Best Practices
- Keep locale-specific logic minimal
- Use translation keys for all text content
- Maintain consistent structure across locales
- Test RTL/LTR rendering for different languages

---

## File: app/[locale]/layout.tsx

### Purpose
Locale-specific layout wrapper that handles internationalization routing and static generation for supported locales.

### Responsibilities
- Define static parameters for supported languages
- Wrap locale-specific pages with proper context
- Enable static generation for all supported locales

### Example Code
```tsx
import { Language } from "@/enums/language.enum";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: Language.EN }, { locale: Language.AR }];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return <>{children}</>;
}
```

### Dependencies
- `@/enums/language.enum`: Language constants

### Relationship to Other Parts
- Works with middleware for locale routing
- Provides context for translation systems
- Integrates with direction provider for RTL support

### Best Practices
- Use async/await for params in App Router
- Generate static params for performance
- Keep layout minimal to avoid nesting issues
- Ensure all supported locales are included

### Scalability Notes
- Easy to add new supported languages
- Supports incremental static regeneration
- Can be extended with locale-specific metadata
- Enables per-locale optimization strategies

---

## File: app/[locale]/page.tsx

### Purpose
Home page component for each locale, displaying the main landing page with hero section, categories, featured products, and deals.

### Responsibilities
- Render main landing page sections
- Handle locale-specific data fetching
- Provide responsive layout for different screen sizes
- Integrate with translation system

### Example Code
```tsx
import HeroSection from "./components/HeroSection/HeroSection";
import CategoriesSection from "./components/CategoriesSection/CategoriesSection";
import FeaturedProductsSection from "./components/FeaturedProductsSection/FeaturedProductsSection";
import DealsSection from "./components/DealsSection/DealsSection";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <DealsSection />
    </main>
  );
}
```

### Dependencies
- Locale-specific section components
- Translation system integration

### Relationship to Other Parts
- Uses section components for modular design
- Integrates with product data systems
- Supports responsive design patterns

### Best Practices
- Keep page components focused on composition
- Use server components for better performance
- Implement proper loading states
- Optimize for Core Web Vitals

### Scalability Notes
- Easy to add new sections
- Supports A/B testing different layouts
- Can implement personalization based on user data
- Enables dynamic content loading strategies

---

## Folder: app/api/

### Purpose
Contains server-side API routes that handle backend logic, data processing, and external service integrations following Next.js API route conventions.

### Contains
- `products/`: Product-related API endpoints
- `upload/`: File upload handling
- Route handlers for RESTful operations

### Best Practices
- Follow RESTful conventions for API design
- Implement proper error handling and validation
- Use TypeScript for type safety
- Consider rate limiting and security measures

---

## File: app/api/products/route.ts

### Purpose
API route handler for product operations, providing endpoints for fetching, filtering, and managing product data.

### Responsibilities
- Handle GET requests for product listings
- Support filtering, sorting, and pagination
- Validate query parameters
- Return structured product data

### Example Code
```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['price-asc', 'price-desc', 'name']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));
    
    // Fetch products based on query parameters
    const products = await getProducts(query);
    
    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: products.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request parameters' },
      { status: 400 }
    );
  }
}
```

### Dependencies
- `next/server`: Next.js server utilities
- `zod`: Schema validation
- Database or service layer for product data

### Relationship to Other Parts
- Consumed by frontend product components
- Integrates with product management system
- Supports search and filtering functionality

### Best Practices
- Implement proper input validation
- Use consistent response format
- Handle errors gracefully
- Consider caching strategies

### Scalability Notes
- Supports pagination for large datasets
- Can implement caching layers
- Enables microservice architecture
- Supports real-time updates with WebSockets

---

## Folder: components/

### Purpose
Contains reusable React components organized by functionality, following atomic design principles for maintainable and scalable UI development.

### Contains
- `common/`: Shared components across the application
- `dashboard/`: Dashboard-specific components
- `providers/`: Context providers for state management
- `ui/`: Base UI components and design system
- `ProductList.tsx`: Product listing component

### Best Practices
- Follow atomic design principles
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Implement proper error boundaries

---

## File: components/ProductList.tsx

### Purpose
Product listing component that displays products in a grid or list format with filtering, sorting, and pagination capabilities.

### Responsibilities
- Render product cards in responsive grid
- Handle loading and error states
- Support different view modes (grid/list)
- Integrate with shopping cart functionality

### Example Code
```tsx
"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux.hooks";
import ProductCard from "@/components/common/ProductCard";
import { fetchProducts } from "@/redux/modules/products/slice";
import type { Product } from "@/types/product.types";

interface ProductListProps {
  category?: string;
  limit?: number;
}

export default function ProductList({ category, limit }: ProductListProps) {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    dispatch(fetchProducts({ category, limit }));
  }, [dispatch, category, limit]);

  if (loading) return <ProductListSkeleton />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4">
      <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
```

### Dependencies
- React hooks for state management
- Redux for data fetching
- ProductCard component for individual items
- Product type definitions

### Relationship to Other Parts
- Consumes product data from Redux store
- Uses ProductCard for rendering individual items
- Integrates with filtering and routing systems

### Best Practices
- Implement proper loading states
- Use responsive design patterns
- Handle empty states gracefully
- Optimize for performance with virtualization

### Scalability Notes
- Supports infinite scrolling
- Can implement virtual scrolling for large lists
- Enables A/B testing different layouts
- Supports personalization and recommendations

---

## Folder: components/providers/

### Purpose
Contains React context providers that supply global state and functionality to the application component tree.

### Contains
- `ReduxProvider.tsx`: Redux store provider
- `DirectionProvider.tsx`: Text direction and locale provider
- `ConditionalLayout.tsx`: Layout conditionality provider

### Best Practices
- Keep providers focused on single responsibilities
- Use proper TypeScript typing
- Implement proper cleanup in useEffect
- Avoid heavy computations in providers

---

## File: components/providers/ReduxProvider.tsx

### Purpose
React Redux provider that makes the Redux store available to all components in the application tree.

### Responsibilities
- Wrap children with Redux Provider
- Provide access to Redux store
- Enable Redux DevTools integration

### Example Code
```tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
```

### Dependencies
- `react-redux`: React Redux bindings
- `@/redux/store`: Configured Redux store

### Relationship to Other Parts
- Provides Redux state to all child components
- Integrates with Redux slices and modules
- Supports Redux DevTools for debugging

### Best Practices
- Keep provider minimal and focused
- Ensure store is properly configured
- Use TypeScript for type safety
- Consider performance implications

### Scalability Notes
- Supports multiple store configurations
- Enables middleware integration
- Can implement state persistence
- Supports code splitting for large stores

---

## File: components/providers/DirectionProvider.tsx

### Purpose
Provider that manages text direction (LTR/RTL) based on the current locale, essential for supporting Arabic and other RTL languages.

### Responsibilities
- Update document direction based on locale
- Apply RTL CSS classes to body
- Handle language changes dynamically
- Provide direction context to components

### Example Code
```tsx
"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";

interface DirectionProviderProps {
  children: React.ReactNode;
}

export default function DirectionProvider({ children }: DirectionProviderProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const isRTL = locale === Language.AR;

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    
    // Add RTL class to body for CSS targeting
    if (isRTL) {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [locale, isRTL]);

  return <>{children}</>;
}
```

### Dependencies
- React hooks for side effects
- Redux hooks for state access
- Language enum for locale constants

### Relationship to Other Parts
- Integrates with language state management
- Works with middleware for locale routing
- Supports CSS styling for RTL layouts

### Best Practices
- Use useEffect for DOM updates
- Clean up side effects properly
- Test with different locales
- Consider performance implications

### Scalability Notes
- Supports additional RTL languages
- Can implement smooth transitions
- Enables per-component direction overrides
- Supports dynamic locale switching

---

## Folder: components/common/

### Purpose
Contains shared components used throughout the application, implementing common UI patterns and functionality.

### Contains
- `ProductCard.tsx`: Product display card
- `ProductSwiper/`: Product carousel component
- `footer/`: Footer component
- `navbar/`: Navigation bar component

### Best Practices
- Keep components reusable and configurable
- Use consistent design patterns
- Implement proper accessibility
- Support internationalization

---

## Folder: enums/

### Purpose
Contains TypeScript enums that define constants for application-wide values, ensuring type safety and consistency.

### Contains
- `language.enum.ts`: Supported language codes
- `routes.enum.ts`: Application route paths
- `theme.enum.ts`: Theme configuration options

### Best Practices
- Use descriptive names
- Group related constants
- Maintain backward compatibility
- Document enum purposes

---

## File: enums/language.enum.ts

### Purpose
Defines supported language codes used throughout the application for internationalization.

### Responsibilities
- Provide type-safe language constants
- Enable consistent language code usage
- Support locale routing and translations

### Example Code
```typescript
export enum Language {
  EN = "en",
  AR = "ar",
}
```

### Dependencies
- None (self-contained constants)

### Relationship to Other Parts
- Used by middleware for locale routing
- Consumed by translation system
- Supports direction provider for RTL

### Best Practices
- Use uppercase enum names
- Keep codes short and standard
- Document supported languages
- Consider future language additions

### Scalability Notes
- Easy to add new supported languages
- Supports locale-specific configurations
- Enables conditional feature availability
- Can integrate with language detection services

---

## File: enums/routes.enum.ts

### Purpose
Defines application route paths as constants, ensuring consistent routing throughout the application.

### Responsibilities
- Provide type-safe route constants
- Enable centralized route management
- Support navigation and linking

### Example Code
```typescript
export enum Routes {
  HOME = "/",
  PRODUCTS = "/products",
  ACCESSORIES = "/accessories",
  COMPARE = "/compare",
  CAREERS = "/careers",
  CONTACT = "/contact",
}
```

### Dependencies
- None (self-contained constants)

### Relationship to Other Parts
- Used by navigation components
- Supports routing in API handlers
- Enables programmatic navigation

### Best Practices
- Use descriptive route names
- Keep routes consistent with URLs
- Document route purposes
- Consider nested route structures

### Scalability Notes
- Easy to add new application routes
- Supports dynamic route generation
- Enables route-based permissions
- Can integrate with analytics tracking

---

## Folder: dict/

### Purpose
Contains translation dictionaries for internationalization, organized by feature and page for maintainable multilingual support.

### Contains
- `Dashboard/`: Dashboard translations
- `Home/`: Home page translations
- `Products/`: Product-related translations
- `common/`: Common UI translations
- `navbar/`: Navigation translations

### Best Practices
- Organize translations by feature
- Use consistent key naming
- Support parameter interpolation
- Maintain translation completeness

---

## Folder: redux/

### Purpose
Contains Redux state management configuration, including store setup, slices, and feature-specific modules.

### Contains
- `modules/`: Feature-specific Redux modules
- `slices/`: Individual Redux slices
- `store.ts`: Redux store configuration

### Best Practices
- Organize state by feature
- Use Redux Toolkit for boilerplate reduction
- Implement proper TypeScript typing
- Keep state normalized

---

## File: redux/store.ts

### Purpose
Central Redux store configuration that combines all reducers and sets up the Redux Toolkit store with proper TypeScript typing.

### Responsibilities
- Configure Redux store with all reducers
- Export TypeScript types for state and dispatch
- Enable Redux DevTools integration
- Set up middleware configuration

### Example Code
```typescript
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/redux/slices/themeSlice";
import languageReducer from "@/redux/slices/languageSlice";
import addProductReducer from "@/redux/modules/addProduct/slice";
import productsReducer from "@/redux/modules/products/slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    addProduct: addProductReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Dependencies
- `@reduxjs/toolkit`: Redux Toolkit utilities
- Feature-specific reducers

### Relationship to Other Parts
- Provides state to all components via providers
- Integrates with Redux slices and modules
- Supports TypeScript throughout the application

### Best Practices
- Keep store configuration minimal
- Use proper TypeScript typing
- Configure middleware appropriately
- Consider performance implications

### Scalability Notes
- Supports lazy loading of reducers
- Enables state persistence strategies
- Can integrate with middleware for logging
- Supports time-travel debugging

---

## Folder: hooks/

### Purpose
Contains custom React hooks that encapsulate reusable logic and state management patterns.

### Contains
- `redux.hooks.ts`: Typed Redux hooks

### Best Practices
- Keep hooks focused and reusable
- Use proper TypeScript typing
- Handle edge cases and errors
- Document hook purposes

---

## File: hooks/redux.hooks.ts

### Purpose
Provides typed Redux hooks that ensure type safety when accessing Redux state and dispatch throughout the application.

### Responsibilities
- Export typed useAppDispatch hook
- Export typed useAppSelector hook
- Ensure TypeScript compatibility with Redux

### Example Code
```typescript
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/types/redux.types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### Dependencies
- `react-redux`: React Redux hooks
- Type definitions for Redux state

### Relationship to Other Parts
- Used by all components accessing Redux state
- Integrates with Redux store configuration
- Supports TypeScript throughout the application

### Best Practices
- Use typed hooks for type safety
- Avoid direct store access
- Keep hooks simple and focused
- Document hook usage patterns

### Scalability Notes
- Supports additional typed hooks
- Enables middleware integration
- Can implement custom state selectors
- Supports performance optimization

---

## Folder: types/

### Purpose
Contains TypeScript type definitions and interfaces that ensure type safety throughout the application.

### Contains
- `navbar.types.ts`: Navbar component types
- `redux.types.ts`: Redux state types

### Best Practices
- Keep types organized and documented
- Use interfaces for object shapes
- Export types for reuse
- Maintain type consistency

---

## File: types/redux.types.ts

### Purpose
Defines TypeScript types for Redux state and dispatch, ensuring type safety when working with Redux throughout the application.

### Responsibilities
- Export RootState type
- Export AppDispatch type
- Ensure type consistency with store

### Example Code
```typescript
import { store } from "@/redux/store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Dependencies
- Redux store configuration

### Relationship to Other Parts
- Used by typed Redux hooks
- Supports TypeScript throughout Redux usage
- Ensures type consistency

### Best Practices
- Import types from store
- Keep type definitions simple
- Use consistent naming conventions
- Document type purposes

### Scalability Notes
- Supports additional type definitions
- Enables type-safe middleware
- Can integrate with API response types
- Supports complex state shapes

---

## Configuration Files

### File: package.json

### Purpose
Defines project dependencies, scripts, and metadata for the Smartbox Next.js application.

### Responsibilities
- List production and development dependencies
- Define build and development scripts
- Configure project metadata
- Enable package management

### Dependencies
- **Next.js**: Modern React framework with App Router
- **React**: UI library with latest version 19.x
- **TypeScript**: Type safety and development experience
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **next-intl**: Internationalization support
- **shadcn/ui**: Component library
- **Supabase**: Backend services
- **Cloudinary**: Image management
- **Zod**: Schema validation

### Best Practices
- Keep dependencies updated
- Use specific versions for stability
- Document custom scripts
- Review security vulnerabilities

### Scalability Notes
- Supports additional feature dependencies
- Enables micro-frontend architecture
- Can integrate with CI/CD pipelines
- Supports deployment configurations

### File: tsconfig.json

### Purpose
TypeScript configuration file that defines compiler options, path mappings, and project settings for type safety and development experience.

### Responsibilities
- Configure TypeScript compiler options
- Set up path aliases for imports
- Define project includes and excludes
- Enable strict type checking

### Best Practices
- Use strict mode for better type safety
- Configure path aliases for clean imports
- Include all relevant file types
- Exclude unnecessary files

### Scalability Notes
- Supports additional path configurations
- Enables project references
- Can integrate with build tools
- Supports multiple TypeScript configurations

---

## Architecture Patterns and Best Practices

### State Management
- **Redux Toolkit**: Modern Redux implementation with reduced boilerplate
- **Feature-based organization**: State organized by application features
- **Typed hooks**: Type-safe access to Redux state
- **Normalized data**: Efficient data structure for complex state

### Internationalization
- **Locale routing**: URL-based language detection
- **RTL support**: Proper text direction handling
- **Translation dictionaries**: Organized by feature
- **Dynamic switching**: Runtime language changes

### Component Architecture
- **Atomic design**: Organized from atoms to organisms
- **Server components**: Optimized rendering with App Router
- **Type safety**: Comprehensive TypeScript implementation
- **Reusable patterns**: Consistent component design

### API Design
- **RESTful conventions**: Standard HTTP methods and status codes
- **Type safety**: TypeScript throughout API layer
- **Error handling**: Consistent error responses
- **Validation**: Input validation with Zod schemas

### Performance Optimization
- **Code splitting**: Automatic with Next.js App Router
- **Image optimization**: Next.js Image component usage
- **Lazy loading**: Component and route-based splitting
- **Caching strategies**: API and static asset caching

### Security Considerations
- **Input validation**: API request validation
- **Type safety**: Compile-time error prevention
- **Environment variables**: Secure configuration management
- **CSRF protection**: Built-in Next.js security features

---

## Development Workflow

### File Organization
```
src/
├── app/                 # Next.js App Router
│   ├── [locale]/       # Internationalized routes
│   ├── api/            # API endpoints
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── common/         # Shared components
│   ├── providers/      # Context providers
│   └── ui/            # Design system
├── dict/              # Translation dictionaries
├── enums/             # Application constants
├── hooks/             # Custom React hooks
├── redux/             # State management
├── types/             # TypeScript definitions
└── middleware.ts      # Next.js middleware
```

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Folders**: Descriptive, singular names
- **Components**: Prefix with feature name when needed
- **Types**: Descriptive interfaces with proper naming

### Import Patterns
```typescript
// External libraries
import React from "react";
import { NextResponse } from "next/server";

// Internal modules (absolute imports)
import { store } from "@/redux/store";
import ProductCard from "@/components/common/ProductCard";
import { Language } from "@/enums/language.enum";
```

This architecture provides a solid foundation for building scalable, maintainable, and performant e-commerce applications with Next.js and modern web technologies.
