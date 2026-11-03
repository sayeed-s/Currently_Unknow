import { api } from "@/lib/axios";

export const StudiDashbord = async (studioId: string) => {
  if (!studioId) {
    throw new Error("studioId is required");
  }

  try {
    const res = await api.get(`/studio/${studioId}`);
    return res.data;
  } catch (error: any) {
    console.error(`Error fetching channel [${studioId}]:`, error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch channel details.",
    );
  }
};
