import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  ClapperboardIcon,
  CoinsIcon,
  DollarSignIcon,
  HandCoinsIcon,
} from "lucide-react";
import React from "react";

// Formatting helper function
const formatAmount = (value: number, isCurrency: boolean = true) => {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  // For numbers under 1,000, use standard commas (e.g., 850 or 2,342)
  return isCurrency
    ? `₹${value.toLocaleString("en-IN")}`
    : value.toLocaleString("en-IN");
};

// Alternative: If you want Indian numbering with commas everywhere (e.g., 2,34,878 instead of 234.8K):
const formatWithCommas = (value: number, isCurrency: boolean = true) => {
  return isCurrency
    ? `₹${value.toLocaleString("en-IN")}`
    : value.toLocaleString("en-IN");
};

const StudioAnalytics = () => {
  const analyticsCard = [
    {
      id: 1,
      title: "Life-Time Earnings",
      icons: DollarSignIcon,
      data: 234878,
      isCurrency: true,
    },
    {
      id: 2,
      title: "Monthly Earnings",
      icons: HandCoinsIcon,
      data: 23422,
      isCurrency: true,
    },
    {
      id: 3,
      title: "Total Videos",
      icons: ClapperboardIcon,
      data: 10,
      isCurrency: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {analyticsCard.map((analytics) => (
        <Card key={analytics.id} className="rounded-xl gap-2 px-2 py-2">
          <CardTitle className="w-full text-sm flex gap-2 items-center text-muted-foreground">
            <analytics.icons className="size-6 text-[#C6A15B] bg-primary-foreground border border-[#C6A15B] rounded-full p-1" />
            {analytics.title}
          </CardTitle>
          <CardContent className="border-t border-muted-foreground/40 py-2 mt-2 px-2">
            <p className="font-bold text-xl dark:text-white flex items-center gap-2">
              {analytics.isCurrency && (
                <CoinsIcon className="size-5 text-[#C6A15B]" />
              )}
              {/* Change formatAmount to formatWithCommas if you prefer comma separation everywhere */}
              {formatAmount(analytics.data, analytics.isCurrency)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudioAnalytics;
