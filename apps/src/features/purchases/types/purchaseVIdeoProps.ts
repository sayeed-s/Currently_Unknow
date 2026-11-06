export interface PurchaseVideoApiResponse {
  success: boolean;
  message: String;
  purchased_videos: PurchaseVideosCardProps[];
}

export interface PurchaseVideosCardProps {
  id: string;
  userId: string;
  videoId: string;
  accessType: string;
  pricePaid: string;
  firstPlayed: null | Date;
  expiresAt: Date;
  createdAt: Date;
  video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    rentPrice: string;
    buyPrice: string;
    duration: number;
    channel: {
      channelName: string;
    };
  };
}
