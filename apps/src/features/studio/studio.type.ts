export interface StudioVideoProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  buyPrice: string;
  rentPrice: string;
  totalEarnings: number;
  totalPurchases: number;
  isPublished: boolean;
  isIntro: boolean;
  channelId: string;
  createdAt: Date;
}

export interface StudioAnalyticsProps {
  Lifetime: number;
  TotalVideos: number;
}

export interface StudioApiResponse {
  success: boolean;
  message: string;
  studio_data: {
    channels: StudioChnnelProps | null;
    videos: StudioVideoProps[] | [];
    totalStudioEarnings: number;
  };
}

export interface StudioChnnelProps {
  id: string;
  bio: string;
  channelName: string;
  channelImage: string;
  channelPoster: string;
  joiningPrice: string;
  isSubscribed: boolean;
  isCreator: boolean;
}
