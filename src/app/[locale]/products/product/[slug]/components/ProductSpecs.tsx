"use client";

import { useAppSelector } from "@/hooks/redux.hooks";
import { Language } from "@/enums/language.enum";
import { productsDictionary as enDict } from "@/dict/Products/en";
import { productsDictionary as arDict } from "@/dict/Products/ar";
import { ProductSpec } from "@/redux/modules/products/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface ProductSpecsProps {
  specs: ProductSpec[];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const locale = useAppSelector((state) => state.language.locale);
  const dictionary = locale === Language.AR ? arDict : enDict;

  // Group specs by category
  const groupedSpecs = specs.reduce((acc, spec) => {
    const category = spec.category || dictionary.productPage.specs.general;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(spec);
    return acc;
  }, {} as Record<string, ProductSpec[]>);

  // If no specs, show empty state
  if (specs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {dictionary.productPage.specs.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {dictionary.productPage.specs.noSpecs}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          {dictionary.productPage.specs.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedSpecs).map(([category, categorySpecs]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {category}
                <Badge variant="outline" className="text-xs">
                  {categorySpecs.length}
                </Badge>
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Specification</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorySpecs.map((spec) => (
                    <TableRow key={spec.id}>
                      <TableCell className="font-medium">
                        {spec.name}
                      </TableCell>
                      <TableCell>
                        {spec.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Product ID
                </span>
                <span className="font-medium">
                  {specs[0]?.id || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Specifications Count
                </span>
                <span className="font-medium">
                  {specs.length} items
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Categories
                </span>
                <span className="font-medium">
                  {Object.keys(groupedSpecs).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Product Specifications</p>
              <p>
                All specifications are provided by the manufacturer and are subject to change. 
                Please verify critical specifications before making a purchase decision.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
