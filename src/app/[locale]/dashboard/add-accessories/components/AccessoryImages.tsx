"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks";
import { uploadImages } from "@/redux/modules/addAccessories/thunks";
import { selectAccessory, selectUploadingImages } from "@/redux/modules/addAccessories/selectors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

export default function AccessoryImages({ dict, isRTL }: { dict: any; isRTL: boolean }) {
  const dispatch = useAppDispatch();
  const accessory = useAppSelector(selectAccessory);
  const uploadingImages = useAppSelector(selectUploadingImages);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      dispatch(uploadImages(imageFiles));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleRemoveImage = () => {
    dispatch({ type: "addAccessories/updateField", payload: { field: "image_url", value: "" } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.images}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive && "border-primary bg-primary/5",
            uploadingImages && "opacity-50 pointer-events-none",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                dragActive ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {uploadingImages ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium">{dict.uploadImages}</p>
              <p className="text-xs text-muted-foreground mt-1">{dict.dragDrop}</p>
              <p className="text-xs text-muted-foreground mt-1">{dict.supportedFormats}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {dict.uploadImages}
            </Button>
          </div>
        </div>

        {/* Current Image */}
        {accessory.image_url && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Current Image</p>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative w-full h-40 bg-muted rounded overflow-hidden">
              <img
                src={accessory.image_url}
                alt="Accessory preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
