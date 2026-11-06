import { api } from "@/lib/axios";
import { VideoApiResponseProps } from "../video/types/video.type";
import { PurchaseVideoApiResponse } from "../purchases/types/purchaseVIdeoProps";

export const VideoDetails = async (
  videoId: string,
  userId?: string, // Make userId optional
): Promise<VideoApiResponseProps> => {
  if (!videoId) {
    throw new Error("videoId is required");
  }

  try {
    // Construct query parameters cleanly
    const queryParam = userId ? `?userId=${encodeURIComponent(userId)}` : "";

    const res = await api.get<VideoApiResponseProps>(
      `/watch/${videoId}${queryParam}`,
    );
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching video [${videoId}]:`, error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch video details.",
    );
  }
};

export const MyPurchaseVideo = async (
  userId: string,
): Promise<PurchaseVideoApiResponse> => {
  if (!userId) {
    throw new Error("User id is requried");
  }

  try {
    const res = await api.get<PurchaseVideoApiResponse>(
      `/purchases?userId=${userId}`,
    );
    return res.data;
  } catch (error: any) {
    console.error("Error Fetching Videos data", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch videos details.",
    );
  }
};
