import { Suspense } from "react";
import VideoCardPage from "@/features/video/components/videoPage";
import { Loader2Icon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardTitle } from "@/components/ui/card";

interface WatchPageProps {
  params: Promise<{ videoId: string }>;
}

export const instant = false;

export default async function WatchPage({ params }: WatchPageProps) {
  const { videoId } = await params;

  return (
    <main className="md:px-4 md:py-8 space-y-6">
      <Suspense
        fallback={
          <div className="w-full aspect-video rounded-xl bg-muted/40 flex items-center justify-center">
            <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <div className="flex flex-col md:flex-row space-x-4 md:gap-4">
          <VideoCardPage videoId={videoId} />
        </div>
      </Suspense>
    </main>
  );
}
