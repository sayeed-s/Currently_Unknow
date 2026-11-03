import { api } from "@/lib/axios";
import { ChannelFormValues } from "../form/channel/types";
import { ChannelApiResponse } from "../channel/types/types";

export async function CreateChannel({
  userId,
  bio,
  channelImage,
  channelName,
  channelPoster,
  joiningPrice = 0,
  channelImagePublicId,
  channelPosterPublicId,
}: ChannelFormValues) {
  const response = await api.post("/channel", {
    userId,
    channelName,
    bio,
    channelImage,
    channelPoster,
    joiningPrice,
    channelImagePublicId,
    channelPosterPublicId,
  });
  return response;
}

export async function GetChannel<ChannelApiResponse>(
  channelId: string,
): Promise<ChannelApiResponse> {
  if (!channelId) {
    throw new Error("channelId is required");
  }

  try {
    const res = await api.get<ChannelApiResponse>(`/channel/${channelId}`);
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching channel [${channelId}]:`, error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch channel details.",
    );
  }
}
