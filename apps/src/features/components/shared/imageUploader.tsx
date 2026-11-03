"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Loader2, UploadCloud, X } from "lucide-react";
import { api } from "@/lib/axios"; // Or standard fetch based on your setup

export interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  label: string;
  value: UploadedImage | UploadedImage[] | null;
  onChange: (value: UploadedImage | UploadedImage[] | null) => void;
  multiple?: boolean;
  aspectRatio?: "square" | "video";
  maxFiles?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  multiple = false,
  aspectRatio = "square",
  maxFiles = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Normalize value into an array for uniform rendering logic
  const images = Array.isArray(value) ? value : value ? [value] : [];

  // Inside your ImageUploader.tsx handleUpload function:
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple && images.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    try {
      setIsUploading(true);
      const uploadedResults: UploadedImage[] = [];

      for (const file of Array.from(files)) {
        // 1. Fetch signature and timestamps from your backend
        const presignRes = await api.get("/imageuplod/presigned");
        const { signature, timestamp, folder, apiKey, cloudName } =
          presignRes.data;

        // 2. Build form data for signed upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", apiKey);
        if (folder) formData.append("folder", folder);

        // 3. Upload directly to Cloudinary
        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData },
        );

        const data = await cloudinaryRes.json();

        // Catch Cloudinary specific errors
        if (!cloudinaryRes.ok) {
          throw new Error(
            data.error?.message || "Failed to upload image to Cloudinary",
          );
        }

        if (data.secure_url && data.public_id) {
          uploadedResults.push({
            url: data.secure_url,
            publicId: data.public_id,
          });
        }
      }

      if (multiple) {
        onChange([...images, ...uploadedResults]);
      } else {
        onChange(uploadedResults[0] || null);
      }
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error.message || error);
      alert(`Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (publicId: string) => {
    if (multiple && Array.isArray(value)) {
      const updated = value.filter((img) => img.publicId !== publicId);
      onChange(updated.length > 0 ? updated : null);
    } else {
      onChange(null);
    }
  };

  const containerHeight = aspectRatio === "video" ? "h-40" : "h-32 w-32";
  const isCircularAvatar = aspectRatio === "square" && !multiple;

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Render Previews */}
        {images.map((img) => (
          <div
            key={img.publicId}
            className={`relative ${containerHeight} ${
              aspectRatio === "video" ? "w-full max-w-xs" : "w-32"
            } ${isCircularAvatar ? "rounded-full" : "rounded-lg"} overflow-hidden border bg-muted shadow-sm`}
          >
            <Image
              src={img.url}
              alt="Uploaded preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(img.publicId)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition shadow z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Upload Box */}
        {(!multiple && images.length === 0) ||
        (multiple && images.length < maxFiles) ? (
          <label
            className={`flex flex-col items-center justify-center border-2 border-dashed ${
              isCircularAvatar ? "rounded-full w-32 h-32" : "rounded-lg"
            } p-6 cursor-pointer hover:border-primary/50 transition bg-muted/30 ${
              aspectRatio === "video" ? "w-full max-w-xs h-40" : "w-32 h-32"
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground text-center">
                  {multiple ? "Upload Images" : "Click to upload"}
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        ) : null}
      </div>
    </div>
  );
};
