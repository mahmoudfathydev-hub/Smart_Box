"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { setImages } from "@/redux/modules/addProduct/slice";
import { uploadImages } from "@/redux/modules/addProduct/thunks";
import { selectProduct, selectUploadingImages } from "@/redux/modules/addProduct/selectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function ProductImages({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const uploading = useAppSelector(selectUploadingImages);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const productName = product.name_en || "product";
      dispatch(uploadImages({ files, productName }));
    }
  };

  const removeImage = (urlToRemove: string) => {
    const updatedImages = product.images_url.filter((url: string) => url !== urlToRemove);
    dispatch(setImages(updatedImages));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.images}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="images">{dict.images}</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-muted-foreground animate-pulse">Uploading...</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.images_url.map((url: string, index: number) => (
            <div key={index} className="relative group rounded-md overflow-hidden border border-input aspect-square">
              <img src={url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
