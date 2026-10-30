"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Smartphone, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export interface CreatorPayoutData {
  payoutMethod: "upi" | "bank";
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
}

const CreatorForm = () => {
  const [payoutMethod, setPayoutMethod] = useState<"upi" | "bank">("upi");
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useAuth();
  const router = useRouter();

  // Form fields
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (payoutMethod === "upi") {
      if (!upiId.trim()) {
        toast.error("Please enter a valid UPI ID");
        return;
      }
    } else {
      if (
        !accountNumber.trim() ||
        !accountHolderName.trim() ||
        !ifscCode.trim()
      ) {
        toast.error("Please fill in all bank detail fields");
        return;
      }
    }

    if (!userId) {
      toast.error("User authentication required");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        payoutMethod,
        upiId: payoutMethod === "upi" ? upiId.trim() : undefined,
        accountHolder:
          payoutMethod === "bank" ? accountHolderName.trim() : undefined,
        accountNumber:
          payoutMethod === "bank" ? accountNumber.trim() : undefined,
        ifscCode:
          payoutMethod === "bank" ? ifscCode.trim().toUpperCase() : undefined,
      };

      const response = await api.post(`/creator/${userId}`, payload);

      if (response.data.success) {
        toast.success("Creator registered successfully!");
        router.push("/creator"); // Redirect to wallet or dashboard after registration
      }
    } catch (error: any) {
      console.error("Creator registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (payoutMethod === "upi") {
      return upiId.trim().length > 0;
    } else {
      return (
        accountNumber.trim().length > 0 &&
        ifscCode.trim().length > 0 &&
        accountHolderName.trim().length > 0
      );
    }
  };

  return (
    <Card className="w-full max-w-lg bg-linear-to-br from-neutral-900 via-neutral-950 to-zinc-900 text-white border-neutral-800 shadow-2xl rounded-2xl overflow-hidden">
      <CardHeader className="space-y-1 pb-4 border-b border-neutral-800/80">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="size-5 text-[#C6A15B]" />
          <CardTitle className="text-xl font-bold tracking-tight">
            Creator Payout Setup
          </CardTitle>
        </div>
        <CardDescription className="text-zinc-400 text-xs">
          Configure how you want to receive your earnings securely.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payout Method Selector */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Select Payout Method
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayoutMethod("upi")}
                className={cn(
                  "flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all font-medium text-sm cursor-pointer",
                  payoutMethod === "upi"
                    ? "bg-white/10 border-[#C6A15B] text-white shadow-lg"
                    : "bg-neutral-900/50 border-neutral-800 text-zinc-400 hover:border-zinc-700",
                )}
              >
                <Smartphone className="size-4 text-[#C6A15B]" />
                <span>UPI ID</span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod("bank")}
                className={cn(
                  "flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border transition-all font-medium text-sm cursor-pointer",
                  payoutMethod === "bank"
                    ? "bg-white/10 border-[#C6A15B] text-white shadow-lg"
                    : "bg-neutral-900/50 border-neutral-800 text-zinc-400 hover:border-zinc-700",
                )}
              >
                <Building2 className="size-4 text-[#C6A15B]" />
                <span>Bank Transfer</span>
              </button>
            </div>
          </div>

          {/* Conditional Input Fields */}
          <div className="space-y-4 pt-2">
            {payoutMethod === "upi" ? (
              <div className="space-y-2 animate-in fade-in-50 duration-300">
                <Label
                  htmlFor="upi-id"
                  className="text-xs text-zinc-300 font-medium"
                >
                  Enter UPI ID / VPA
                </Label>
                <Input
                  id="upi-id"
                  type="text"
                  placeholder="e.g. username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-zinc-600 focus-visible:ring-[#C6A15B]"
                />
                <p className="text-[11px] text-zinc-500">
                  Payouts will be sent directly to your linked UPI handle
                  instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                <div className="space-y-2">
                  <Label
                    htmlFor="acc-holder"
                    className="text-xs text-zinc-300 font-medium"
                  >
                    Account Holder Name
                  </Label>
                  <Input
                    id="acc-holder"
                    type="text"
                    placeholder="As per bank records"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-zinc-600 focus-visible:ring-[#C6A15B]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="acc-number"
                    className="text-xs text-zinc-300 font-medium"
                  >
                    Account Number
                  </Label>
                  <Input
                    id="acc-number"
                    type="text"
                    placeholder="Enter bank account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-zinc-600 focus-visible:ring-[#C6A15B]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="ifsc-code"
                    className="text-xs text-zinc-300 font-medium"
                  >
                    IFSC Code
                  </Label>
                  <Input
                    id="ifsc-code"
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="bg-neutral-900 border-neutral-800 text-white placeholder:text-zinc-600 font-mono uppercase focus-visible:ring-[#C6A15B]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-neutral-800/80">
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full bg-[#C6A15B] hover:bg-[#b08d4a] text-neutral-950 font-semibold py-2.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                "Submitting for Verification..."
              ) : (
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="size-4" />
                  <span>Proceed to Verification</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatorForm;
