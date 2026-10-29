"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoinsIcon, RefreshCw, CreditCard } from "lucide-react";
import { TransactionTypes, WalletBalanceCardProps } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { getWalletDetails } from "@/features/actions/wallet.action";
import WalletaTopUp from "./walletTopUp";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const WalletBalanceCard = ({
  type = "wallet",
  onTopUp,
}: WalletBalanceCardProps) => {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // 1. Lightweight Query: Runs ONLY for the Header Badge view (No transactions)
  const {
    data: badgeData,
    isLoading: isBadgeLoading,
    refetch: refetchBadge,
    isFetching: isBadgeFetching,
  } = useQuery({
    queryKey: ["wallet", userId, "badge"],
    queryFn: () => getWalletDetails(userId!, false),
    enabled: isLoaded && !!userId && type === "Badge",
  });

  // 2. Heavy Query: Runs ONLY when user is on the dedicated wallet page (Includes transactions)
  const {
    data: walletPageData,
    isLoading: isWalletLoading,
    refetch: refetchWallet,
    isFetching: isWalletFetching,
  } = useQuery({
    queryKey: ["wallet", userId, "full"],
    queryFn: () => getWalletDetails(userId!, true),
    enabled: isLoaded && !!userId && type === "wallet",
  });

  // 3. Handle Clerk loading state safely
  if (!isLoaded) {
    return null;
  }

  // Select active data and loading states based on component type
  const walletData =
    type === "Badge" ? badgeData?.walletData : walletPageData?.walletData;
  const balance = Number(walletData?.walletBalance) ?? 0;
  const isLoading =
    type === "Badge"
      ? isBadgeLoading || isBadgeFetching
      : isWalletLoading || isWalletFetching;
  const activeRefetch = type === "Badge" ? refetchBadge : refetchWallet;

  // 4. Header Badge View
  if (type === "Badge") {
    return (
      <Card
        onClick={() => {
          router.push("/wallet");
        }}
        className="w-full max-w-fit px-4 py-1 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
      >
        <CardContent className="p-0 flex items-center gap-2 justify-center text-sm font-medium">
          <CoinsIcon className="size-5 text-[#C6A15B]" />
          <span className="font-semibold">
            {isLoading ? "..." : balance.toFixed(2)}
          </span>
        </CardContent>
      </Card>
    );
  }

  // 5. Dedicated Wallet Page View
  return (
    <div className="md:flex-row space-y-6 md:items-start justify-center flex flex-col items-center md:space-y-0 md:space-x-8 px-4 w-full max-w-7xl mx-auto">
      {/* Left Column: Premium Card & Top Up Form */}
      <div className="w-full max-w-md space-y-6">
        {/* Premium Credit Card Styling */}
        <Card className="w-full bg-linear-to-br from-neutral-900 via-neutral-950 to-zinc-900 text-white border-neutral-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 rounded-2xl aspect-5/2">
          {/* Background Decorative Gold Glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#C6A15B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top: Brand / Chip & Refresh */}
          <div className="flex items-center justify-between z-10">
            <div className="z-10 my-auto">
              <p className="text-xs tracking-wider uppercase text-zinc-400 font-medium">
                Available Tokens
              </p>
              <div className="text-3xl font-extrabold tracking-tight flex items-center space-x-2 text-white mt-1">
                <CoinsIcon className="size-6 text-[#C6A15B]" />
                {isLoading ? (
                  <Skeleton className="h-8 w-32 bg-zinc-800" />
                ) : (
                  <span>{balance.toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-zinc-400 font-mono">
                ID: {walletData?.id ? `${walletData.id.slice(0, 6)}...` : "N/A"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                onClick={() => activeRefetch()}
                disabled={isLoading}
                title="Refresh Wallet"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Card Middle: Balance */}

          {/* Card Bottom: Card Holder & Validity */}
          <div className="flex items-end justify-between z-10 pt-2 border-t border-zinc-800/60">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                Card Holder
              </p>
              <p className="text-sm font-medium tracking-wide text-zinc-200 truncate max-w-45">
                {user?.fullName || user?.firstName || "Valued Member"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                Expires
              </p>
              <p className="text-xs font-mono font-medium text-zinc-300">
                09 / 59
              </p>
            </div>
          </div>
        </Card>

        {/* Top Up Component */}
        {walletData && (
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <WalletaTopUp
              walletId={walletData?.id || ""}
              onSuccess={() => {
                refetchWallet();
              }}
            />
          </div>
        )}
      </div>

      {/* Right Column: Transactions Section */}
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Recent Transactions
          </h2>
        </div>
        <div className="space-y-3 max-h-120 overflow-y-auto pr-1">
          {walletData?.walletTransactions &&
          walletData.walletTransactions.length > 0 ? (
            walletData.walletTransactions.map((tx: TransactionTypes) => (
              <Card
                key={tx.id}
                className="p-4 shadow-xs rounded-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">
                    ID: {`${tx.id.slice(0, 8)}...`}
                  </span>
                  {tx.createdAt && (
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="capitalize text-sm font-semibold">
                    {tx.type.replace("_", " ")}
                  </span>
                  <span
                    className={cn(
                      tx.amount < 0
                        ? "text-red-500"
                        : "text-emerald-600 dark:text-emerald-400",
                      "font-bold text-base",
                    )}
                  >
                    {tx.amount < 0 ? "-" : "+"} ₹{" "}
                    {Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed rounded-xl">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent transactions found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;
