// src/features/components/MultiUseDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface Props {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const MultiUseDialog = ({
  title,
  description,
  children,
  open,
  onOpenChange,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl bg-zinc-950 border border-zinc-800/80 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-white wrap-words">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed w-full wrap-words">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Child container forces all nested inputs/elements to fill and wrap inside bounds */}
        <div className="mt-4 w-full flex flex-col overflow-x-hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiUseDialog;
