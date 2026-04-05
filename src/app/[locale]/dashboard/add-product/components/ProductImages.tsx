"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { setImages } from "@/redux/modules/addProduct/slice";
import { uploadImages } from "@/redux/modules/addProduct/thunks";
import { selectProduct, selectUploadingImages, selectAddProductErrors } from "@/redux/modules/addProduct/selectors";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, FileImage, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductImages({ dict }: { dict: any }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProduct);
  const uploading = useAppSelector(selectUploadingImages);
  const errors = useAppSelector(selectAddProductErrors);
  const [localError, setLocalError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    setLocalError(null);
    const totalImages = product.images_url.length + acceptedFiles.length;

    if (totalImages > 4) {
      setLocalError(`You can only upload a maximum of 4 images. Currently you have ${product.images_url.length}.`);
      return;
    }

    const compressedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          return await imageCompression(file, options);
        } catch (error) {
          console.error("Compression error:", error);
          return file;
        }
      })
    );

    const productName = product.name_en || "product";
    dispatch(uploadImages({ files: compressedFiles as File[], productName }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled: uploading || product.images_url.length >= 4,
  });

  const removeImage = (urlToRemove: string) => {
    const updatedImages = product.images_url.filter((url: string) => url !== urlToRemove);
    dispatch(setImages(updatedImages));
  };

  return (
    <Card className={cn(errors.images_url && "border-destructive")}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {dict.images}
          <span className="text-xs font-normal text-muted-foreground">
            {product.images_url.length} / 4
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
            (uploading || product.images_url.length >= 4) && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <div className="bg-primary/10 p-3 rounded-full">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {isDragActive ? "Drop the images here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG or WEBP (Max. 4 images, optimized automatically)
            </p>
          </div>
          {uploading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-primary animate-pulse font-medium">
              <Upload className="w-4 h-4 animate-bounce" />
              Uploading and optimizing...
            </div>
          )}
        </div>

        {(localError || errors.images_url) && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <p>{localError || errors.images_url}</p>
          </div>
        )}

        {product.images_url.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.images_url.map((url: string, index: number) => (
              <div key={index} className="relative group rounded-md overflow-hidden border border-input aspect-square bg-muted">
                <img src={url} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] py-1 text-center font-bold">
                    MAIN IMAGE
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
