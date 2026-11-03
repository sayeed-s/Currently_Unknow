export interface StudioVideoProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  buyPrice: string;
  rentPrice: string;
  totalEarnings: string;
  totalPurchases: string;
  isPublished: boolean;
  isIntro: boolean;
  createdAt: Date;
}

export interface StudioAnalyticsProps {
  Lifetime: number;
  TotalVideos: number;
}
