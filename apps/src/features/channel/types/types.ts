export interface channelProps {
  id: string;
  channelName: string;
  bio: string;
  channelPoster: string;
  channelImage: string;
  createdAt: Date;
  isSubscribed: boolean;
  joiningPrice: string;
}
export interface ChannelApiResponse {
  success: boolean;
  message: string;
  channel: channelProps;
}

export interface UserChannelViewApiResProps {
  success: boolean;
  message: string;
  channels: UserChannelViewProps[];
}

export interface UserChannelViewProps {
  id: string;
  channelName: string;
  bio: string;
  channelImage: string;
  isSubscribed: boolean;
  joiningPrice: string;
}

export interface ChannelVideosApiResponse {
  success: boolean;
  message: string;
  videos: ChannelVideoProps[];
}

export interface ChannelVideoProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isIntro: boolean;
  isPurchased: boolean;
  duration: number;
  rentPrice: string;
  buyPrice: string;
  createdAt: Date;
}
