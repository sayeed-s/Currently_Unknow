"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full m-auto flex items-center justify-center px-4 py-12">
      <div className="relative max-w-lg w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/40 shadow-2xl overflow-hidden">
        {/* Subtle Background Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
          <Film className="w-10 h-10 animate-pulse" />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Scene Not Found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            The video, channel, or page you are looking for might have been
            removed, made private, or never existed in this timeline.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            asChild
            variant="default"
            className="w-full sm:w-auto rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto rounded-xl px-6 font-semibold border-border/60 hover:bg-muted/50 transition-all"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Footer Hint */}
        <div className="pt-4 border-t border-border/40 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Search className="w-3.5 h-3.5" />
          <span>
            Looking for a creator? Try checking your subscription feed.
          </span>
        </div>
      </div>
    </div>
  );
}
