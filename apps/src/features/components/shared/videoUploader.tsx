// src/components/shared/VideoUploader.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Video, X, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface MuxUploadResult {
  uploadId: string;
}

interface VideoUploaderProps {
  // Callback returning only the uploadId to hook into the main form
  onUploadSuccess: (result: MuxUploadResult) => void;
  disabled?: boolean;
  className?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadSuccess,
  disabled = false,
  className,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file (MP4, MOV, WebM)");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setProgress(5);

      // 1. Request a clean Direct Upload URL from the backend (No DB record created here)
      const res = await api.post("/upload/mux");
      const { uploadUrl, uploadId } = res.data;

      if (!uploadUrl || !uploadId) {
        throw new Error("Failed to retrieve upload URL from server.");
      }

      setProgress(20);

      // 2. Stream the video file directly to Mux using XMLHttpRequest for precise progress tracking
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", selectedFile.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            // Scale progress smoothly from 20% to 95%
            const percentComplete =
              Math.round((event.loaded / event.total) * 75) + 20;
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgress(100);
            resolve(xhr.response);
          } else {
            reject(
              new Error(`Mux direct upload failed with status ${xhr.status}`),
            );
          }
        };

        xhr.onerror = () =>
          reject(new Error("Network error occurred during video upload."));
        xhr.send(selectedFile);
      });

      setIsUploaded(true);
      toast.success("Video uploaded successfully! Processing encoding...");

      // 3. Pass the uploadId back to the main form state
      onUploadSuccess({ uploadId });
    } catch (error: any) {
      console.error("Video upload error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to upload video file.",
      );
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setProgress(0);
    setIsUploaded(false);
    setIsUploading(false);
  };

  return (
    <div
      className={cn(
        "space-y-4 border-2 border-dashed rounded-xl p-6 bg-card transition-all",
        className,
      )}
    >
      {!selectedFile ? (
        <label className="flex flex-col items-center justify-center space-y-3 cursor-pointer py-6 group">
          <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
            <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-base">
              Click to upload video file
            </h3>
            <p className="text-xs text-muted-foreground">
              MP4, MOV, or WebM formats supported
            </p>
          </div>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border">
            <div className="flex items-center space-x-3 truncate">
              <Video className="w-5 h-5 text-primary shrink-0" />
              <div className="truncate">
                <p className="text-sm font-medium truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && !isUploaded && (
              <button
                type="button"
                onClick={handleReset}
                className="text-muted-foreground hover:text-destructive transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>
                  {progress === 100
                    ? "Finalizing upload..."
                    : "Uploading securely to Mux..."}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}

          {!isUploading && !isUploaded && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-1/3"
                disabled={disabled}
              >
                Change File
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                className="w-2/3"
                disabled={disabled}
              >
                Start Video Upload
              </Button>
            </div>
          )}

          {isUploaded && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Video file successfully staged for publishing!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
