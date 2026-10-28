import MediaPlayer from "@/components/video-ui/video-player";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  return (
    <div className="flex-1 bg-primary flex items-center justify-center">
      show how page after sign-in
      <Link href={"/home"}>home page</Link>
    </div>
  );
}
