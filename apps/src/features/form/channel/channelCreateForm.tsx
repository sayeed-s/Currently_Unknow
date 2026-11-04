"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { channelFormSchema, ChannelFormValues } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ImageUploader,
  UploadedImage,
} from "@/features/components/shared/imageUploader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { CreateChannel } from "@/features/actions/channel.action";

interface ChannelCreationFormProps {
  userId: string;
}

export const ChannelCreationForm: React.FC<ChannelCreationFormProps> = ({
  userId,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChannelFormValues>({
    resolver: zodResolver(channelFormSchema),
    defaultValues: {
      userId,
      channelName: "",
      bio: "",
      channelImage: "",
      channelImagePublicId: "",
      channelPoster: "",
      channelPosterPublicId: "",
      joiningPrice: 0,
    },
  });

  const channelImage = watch("channelImage");
  const channelImagePublicId = watch("channelImagePublicId");
  const channelPoster = watch("channelPoster");
  const channelPosterPublicId = watch("channelPosterPublicId");

  const onSubmit = async (data: ChannelFormValues) => {
    try {
      const response = await CreateChannel(data);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to create channel");
      }

      toast.success(`Channel '${result.newChannel.channelName}' is now live!`);
      router.push(`/channel/${result.newChannel.id}`);
      router.refresh();
    } catch (error: any) {
      console.error("Submission error:", error);
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
      className="space-y-6 max-w-xl mx-auto p-6 h-full overflow-auto rounded-xl shadow-md bg-background border"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Channel Setup</h2>
        <p className="text-sm text-muted-foreground">
          Configure your public creator channel identity.
        </p>
      </div>

      {/* Channel Name */}
      <div className="space-y-2">
        <Label htmlFor="channelName">Channel Name *</Label>
        <Input
          id="channelName"
          placeholder="e.g. Acme Tech"
          {...register("channelName")}
        />
        {errors.channelName && (
          <p className="text-xs text-destructive">
            {errors.channelName.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell your audience what your channel is about..."
          {...register("bio")}
          rows={3}
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio.message}</p>
        )}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Channel Avatar (Circular view) */}
        <div className="space-y-2">
          <ImageUploader
            label="Channel Logo / Avatar *"
            value={
              channelImage && channelImagePublicId
                ? { url: channelImage, publicId: channelImagePublicId }
                : null
            }
            multiple={false}
            aspectRatio="square"
            onChange={(val) => {
              const single = val as UploadedImage | null;
              setValue("channelImage", single?.url || "", {
                shouldValidate: true,
              });
              setValue("channelImagePublicId", single?.publicId || "", {
                shouldValidate: true,
              });
            }}
          />
          {errors.channelImage && (
            <p className="text-xs text-destructive">
              {errors.channelImage.message}
            </p>
          )}
        </div>

        {/* Channel Poster Banner */}
        <div className="space-y-2">
          <ImageUploader
            label="Channel Poster Banner"
            value={
              channelPoster && channelPosterPublicId
                ? { url: channelPoster, publicId: channelPosterPublicId }
                : null
            }
            multiple={false}
            aspectRatio="video"
            onChange={(val) => {
              const single = val as UploadedImage | null;
              setValue("channelPoster", single?.url || "", {
                shouldValidate: true,
              });
              setValue("channelPosterPublicId", single?.publicId || "", {
                shouldValidate: true,
              });
            }}
          />
          {errors.channelPoster && (
            <p className="text-xs text-destructive">
              {errors.channelPoster.message}
            </p>
          )}
        </div>
      </div>

      {/* Joining Price */}
      <div className="space-y-2">
        <Label htmlFor="joiningPrice">Joining Price ($)</Label>
        <Input
          id="joiningPrice"
          type="number"
          step="0.01"
          {...register("joiningPrice", { valueAsNumber: true })}
        />
        {errors.joiningPrice && (
          <p className="text-xs text-destructive">
            {errors.joiningPrice.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating Channel..." : "Launch Channel"}
      </Button>
    </form>
  );
};

export default ChannelCreationForm;
