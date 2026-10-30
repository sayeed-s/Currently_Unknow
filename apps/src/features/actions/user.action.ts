import { api } from "@/lib/axios";

interface creatorProps {
  id: string;
  userId: string;
  payoutMethod: string;
  upiId?: string | null;
  accountHolderName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserRepsoneProps {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  creatorProfile: null | creatorProps;
}

export async function GetProfile(userId: string): Promise<UserRepsoneProps> {
  const response = await api.get<UserRepsoneProps>(`/user/${userId}`);
  return response.data;
}
