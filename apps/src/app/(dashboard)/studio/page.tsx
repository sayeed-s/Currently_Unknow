"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const userRole = user?.publicMetadata?.role;
  const isUser = userRole !== "CREATOR";

  useEffect(() => {
    // Once loaded, if the user is not a creator, redirect them away
    if (isLoaded && isUser) {
      router.replace("/creator"); // Change to wherever non-creators should be sent
    }
  }, [isLoaded, isUser, router]);

  // Show a smooth loading spinner while Clerk fetches user session & metadata
  if (!isLoaded) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#C6A15B]" />
      </div>
    );
  }

  // Prevent rendering the page content briefly before the redirect fires
  if (isUser) {
    return null;
  }
  return <div className="px-4">Create a channel</div>;
};

export default page;
