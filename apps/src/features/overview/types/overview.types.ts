export interface OverViewApiReposne {
  success: boolean;
  message: string;
  videos: overviewVideos[];
}

export interface overviewVideos {
  id: string;
  title: string;
  rentPrice: string;
  buyPrice: string;
  duration: number;
  thumbnailUrl: string;
  createdAt: Date;
  videoProgress: [];
  channel: {
    id: string;
    channelName: string;
    channelImage: string;
  };
  isPurchased: boolean;
  purchaseExpiresAt: Date | null;
}
