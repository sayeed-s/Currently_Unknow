import { api } from "@/lib/axios";
import { OverViewApiReposne } from "../overview/types/overview.types";

export const GetOverView = async (
  userId: string,
): Promise<OverViewApiReposne> => {
  try {
    if (!userId) {
      throw new Error("UserId is Required");
    }
    const res = await api.get<OverViewApiReposne>(`/overview?userId=${userId}`);
    return res.data;
  } catch (error: any) {
    console.error("Error while getting overview data");
    throw new Error(
      error?.response?.data?.message || "Failed to fetch overview Data.",
    );
  }
};
