// features/video/components/VideoCreationForm.tsx
"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  videoFormSchema,
  VideoFormValues,
} from "@/features/video/types/video.type";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  VideoUploader,
  MuxUploadResult,
} from "@/features/components/shared/videoUploader";
import {
  ImageUploader,
  UploadedImage,
} from "@/features/components/shared/imageUploader";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Film, DollarSign, Settings, Image as ImageIcon } from "lucide-react";

interface VideoCreationFormProps {
  channelId: string;
  onRefresh: () => void;
  closeForm: () => void;
}

export const VideoCreationForm: React.FC<VideoCreationFormProps> = ({
  channelId,
  closeForm,
  onRefresh,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      channelId,
      title: "",
      description: "",
      muxUploadId: "",
      thumbnailUrl: "",
      thumbnailPublicId: "",
      isIntro: false,
      isPublished: false,
      rentPrice: 5.0,
      buyPrice: undefined,
    },
  });

  const thumbnailUrl = watch("thumbnailUrl");
  const thumbnailPublicId = watch("thumbnailPublicId");
  const muxUploadId = watch("muxUploadId");
  const title = watch("title");
  const description = watch("description");
  const rentPrice = watch("rentPrice");
  const buyPrice = watch("buyPrice");

  const onSubmit = async (data: VideoFormValues) => {
    try {
      const response = await api.post("/studio/video", data);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to create video record");
      }

      toast.success("Video uploaded and published successfully!");
      onRefresh();
      closeForm();
    } catch (error: any) {
      console.error("Video submission error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-3xl mx-auto p-6 lg:p-8 border rounded-2xl shadow-sm"
    >
      {/* Header */}
      <div className="border-b pb-4 space-y-1">
        <div className="flex items-center space-x-2 text-primary">
          <Film className="w-5 h-5" />
          <h2 className="text-xl font-bold tracking-tight">Upload New Video</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Fill in metadata, upload media assets, and set monetization rules for
          your channel.
        </p>
      </div>

      {/* Section 1: Basic Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          1. Basic Details
        </h3>

        <div className="space-y-2">
          <Label htmlFor="title">Video Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Masterclass in Modern Web Architecture"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Write a clear summary of what viewers will learn..."
            rows={4}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-destructive font-medium">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Section 2: Media Assets */}
      <div className="space-y-6 pt-4 border-t">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          2. Media Uploads
        </h3>

        {/* Video File Uploader */}
        <div className="space-y-2">
          <Label>Video File (Secure Mux Stream) *</Label>
          <VideoUploader
            metadata={{
              channelId,
              title,
              description,
              rentPrice: Number(rentPrice),
              buyPrice: buyPrice ? Number(buyPrice) : 0,
            }}
            onUploadSuccess={(result: MuxUploadResult) => {
              setValue("muxUploadId", result.uploadId, {
                shouldValidate: true,
              });
            }}
          />
          {muxUploadId && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Video file staged successfully
            </p>
          )}
          {errors.muxUploadId && (
            <p className="text-xs text-destructive font-medium">
              {errors.muxUploadId.message}
            </p>
          )}
        </div>

        {/* Thumbnail Uploader */}
        <div className="space-y-2">
          <ImageUploader
            label="Video Thumbnail Banner *"
            value={
              thumbnailUrl
                ? { url: thumbnailUrl, publicId: thumbnailPublicId || "" }
                : null
            }
            multiple={false}
            aspectRatio="video"
            onChange={(val) => {
              const single = val as UploadedImage | null;
              setValue("thumbnailUrl", single?.url || "", {
                shouldValidate: true,
              });
              setValue("thumbnailPublicId", single?.publicId || "", {
                shouldValidate: true,
              });
            }}
          />
          {errors.thumbnailUrl && (
            <p className="text-xs text-destructive font-medium">
              {errors.thumbnailUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Section 3: Pricing & Monetization */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          3. Monetization & Pricing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="space-y-2">
            <Label htmlFor="rentPrice">Rental Price ($) *</Label>
            <Input
              id="rentPrice"
              type="number"
              min={1}
              step="0.01"
              {...register("rentPrice", { valueAsNumber: true })}
            />
            <p className="text-[11px] text-muted-foreground">
              Required access fee (e.g. 48hr window)
            </p>
            {errors.rentPrice && (
              <p className="text-xs text-destructive font-medium">
                {errors.rentPrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyPrice">
              Lifetime Buy Price ($){" "}
              <span className="text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              id="buyPrice"
              type="number"
              min={0}
              step="0.01"
              placeholder="e.g. 19.99"
              {...register("buyPrice", {
                valueAsNumber: true,
                setValueAs: (v) =>
                  v === "" || Number.isNaN(v) ? undefined : parseFloat(v),
              })}
            />
            <p className="text-[11px] text-muted-foreground">
              Leave blank if lifetime purchase is disabled
            </p>
            {errors.buyPrice && (
              <p className="text-xs text-destructive font-medium">
                {errors.buyPrice.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Visibility & Publishing Settings */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          4. Publishing & Player Settings
        </h3>

        <div className="space-y-4 p-4 border rounded-xl bg-muted/20">
          {/* Intro Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">
                Intro / Trailer Video
              </Label>
              <p className="text-xs text-muted-foreground">
                Mark this video as a free public preview for channel visitors.
              </p>
            </div>
            <Controller
              name="isIntro"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="border-t pt-3" />

          {/* Publish Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">
                Publish Immediately
              </Label>
              <p className="text-xs text-muted-foreground">
                Make this video live on your channel once Mux encoding finishes.
              </p>
            </div>
            <Controller
              name="isPublished"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Form Footer Actions */}
      <div className="pt-4 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={closeForm}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-35">
          {isSubmitting ? "Publishing..." : "Publish Video"}
        </Button>
      </div>
    </form>
  );
};

export default VideoCreationForm;
