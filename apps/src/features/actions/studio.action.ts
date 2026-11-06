import { api } from "@/lib/axios";
import { StudioApiResponse } from "../studio/studio.type";

export const StudiDashbord = async (
  studioId: string,
): Promise<StudioApiResponse> => {
  if (!studioId) {
    throw new Error("studioId is required");
  }
  try {
    const res = await api.get<StudioApiResponse>(`/studio/${studioId}`);
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching channel [${studioId}]:`, error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch channel details.",
    );
  }
};
