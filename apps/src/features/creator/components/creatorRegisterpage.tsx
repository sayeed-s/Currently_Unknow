"use client";

import React, { useEffect } from "react";
import CreatorForm from "./creatorForm";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const CreatorProtectedPage = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const userRole = user?.publicMetadata?.role;
  const isCreator = userRole === "CREATOR";

  useEffect(() => {
    // Once loaded, if the user is not a creator, redirect them away
    if (isLoaded && isCreator) {
      router.push("/studio"); // Change to wherever non-creators should be sent
    }
  }, [isLoaded, isCreator, router]);

  // Show a smooth loading spinner while Clerk fetches user session & metadata
  if (!isLoaded) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#C6A15B]" />
      </div>
    );
  }

  // Prevent rendering the page content briefly before the redirect fires
  if (isCreator) {
    return null;
  }

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-80 bg-[#C6A15B]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mb-12 relative z-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold">
          Exclusive Studio Access
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Creator Dashboard & Tools
        </h1>
        <p className="text-sm text-zinc-400">
          Manage your digital storefront, upload and publish video content, and
          track your earnings seamlessly.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-6xl flex gap-10 items-center justify-center relative z-10">
        <div className="flex justify-center w-full">
          <CreatorForm />
        </div>
      </div>
    </div>
  );
};

export default CreatorProtectedPage;
