// features/form/video/types.ts
import { z } from "zod";

export const videoFormSchema = z.object({
  channelId: z.string().min(1, "Channel ID is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),

  // Mux identifiers returned by the uploader
  muxUploadId: z.string().min(1, "Video file is required"),

  // Thumbnail image fields (Cloudinary)
  thumbnailUrl: z.string().min(1, "Thumbnail image is required"),
  thumbnailPublicId: z.string().optional(),

  // Toggles
  isIntro: z.boolean().default(false),
  isPublished: z.boolean().default(false),

  // Pricing (Rent is required, Buy is optional)
  rentPrice: z.number().min(0.01, "Rent price must be at least 0.01"),
  buyPrice: z.number().optional().default(0),
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;
