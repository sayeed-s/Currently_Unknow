export interface channelProps {
  id: string;
  channelName: string;
  bio: string;
  channelPoster: string;
  channelImage: string;
  createdAt: Date;
  joiningPrice: string;
}
export interface ChannelApiResponse {
  success: boolean;
  message: string;
  channel: channelProps;
}
