import { api } from "@/lib/axios";
import { ChannelFormValues } from "../form/channel/types";
import {
  ChannelApiResponse,
  ChannelVideosApiResponse,
  UserChannelViewApiResProps,
  UserChannelViewProps,
} from "../channel/types/types";

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

export async function GetChannel(
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

export async function GetChannels(
  userId: string,
): Promise<UserChannelViewProps[]> {
  try {
    const res = await api.get<UserChannelViewApiResProps>(
      `/channel?userId=${userId}`,
    );
    return res.data.channels;
  } catch (error: any) {
    console.error("Error fetching the channels details", error.message);
    throw new Error(
      error?.response?.data?.message || "Failed to Fetch the channels details",
    );
  }
}

export async function GetChannelVideos(
  chnId: string,
): Promise<ChannelVideosApiResponse> {
  try {
    const res = await api.get<ChannelVideosApiResponse>(
      `/channel/${chnId}/videos`,
    );
    return res.data;
  } catch (error: any) {
    console.error("Error fetching the channels videos", error.message);
    throw new Error(
      error?.response?.data?.message || "Failed to Fetch the channels videos",
    );
  }
}
