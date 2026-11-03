// schemas/channelSchema.ts
import * as z from "zod";

export const channelFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  channelName: z.string().min(3, "Channel name must be at least 3 characters"),
  bio: z
    .string()
    .min(10, "Bio should be at least 10 characters")
    .optional()
    .or(z.literal("")),
  channelImage: z.url("A valid channel image URL is required"),
  channelImagePublicId: z.string().min(1, "Image public ID is required"),
  channelPoster: z
    .string()
    .url("A valid poster URL is required")
    .optional()
    .or(z.literal("")),
  channelPosterPublicId: z.string().optional(),
  joiningPrice: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "Price cannot be negative"),
  ),
});

export type ChannelFormValues = z.infer<typeof channelFormSchema>;
