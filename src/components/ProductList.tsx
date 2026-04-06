"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/redux/modules/addProduct/thunks";
import {
  selectProducts,
  selectFetchingProducts,
  selectAddProductError,
} from "@/redux/modules/addProduct/selectors";
import { Product } from "@/redux/modules/addProduct/types";
import { Loader2, RefreshCw, Edit, Trash2, Eye } from "lucide-react";

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectFetchingProducts);
  const error = useSelector(selectAddProductError);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchProducts() as any);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-4">Error loading products: {error}</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No products found in the database.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.images_url && product.images_url.length > 0 && (
                          <img
                            src={product.images_url[0]}
                            alt={product.name_en}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name_en}</div>
                          <div className="text-sm text-gray-500">{product.name_ar}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{product.category_en}</div>
                        <div className="text-sm text-gray-500">{product.category_ar}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{product.brand_en}</div>
                        <div className="text-sm text-gray-500">{product.brand_ar}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatPrice(product.price)}</div>
                      {product.discount > 0 && (
                        <div className="text-sm text-green-600">
                          {product.discount}% off
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.stock}</div>
                      <Badge variant={stockStatus.variant} className="text-xs">
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Refreshing...</span>
        </div>
      )}
    </div>
  );
}
