import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { CameraDevice } from "@/features/scan/hooks/useCamera";
import { CameraIcon, UploadIcon } from "lucide-react";
import { RefObject, useRef } from "react";

type CameraViewProps = {
  // Camera mode
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraState: "idle" | "starting" | "active" | "error";
  cameraError?: string;
  cameraList: CameraDevice[];
  selectedCamera: string;
  onStartCamera: () => void;
  onSwitchCamera: (deviceId: string) => void;
  onCapture: () => void;
  // Upload mode
  onUpload: (file: File) => void;
  // Shared
  isProcessing: boolean;
  progress?: number;
  loadingMessage?: string;
  // Active tab
  mode: "camera" | "upload";
  onModeChange: (mode: "camera" | "upload") => void;
};

const cameraErrorMessage = (errorName: string) => {
  switch (errorName) {
    case "NotAllowedError":
      return "Camera permission denied by the system. Check macOS System Settings → Privacy & Security → Camera and allow your browser.";
    case "NotFoundError":
      return "No camera found on this device.";
    case "NotReadableError":
      return "Camera is already in use by another app. Close it and try again.";
    case "OverconstrainedError":
      return "Camera does not support the requested settings.";
    default:
      return `Camera error: ${errorName}. Check browser console for details.`;
  }
};

const CameraView = ({
  videoRef,
  cameraState,
  cameraError = "",
  cameraList,
  selectedCamera,
  onStartCamera,
  onSwitchCamera,
  onCapture,
  onUpload,
  isProcessing,
  progress = 0,
  loadingMessage,
  mode,
  onModeChange,
}: CameraViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Tab switcher */}
      <div className="flex rounded-xl bg-muted p-1 gap-1">
        <button
          id="scan-tab-camera"
          onClick={() => onModeChange("camera")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === "camera"
              ? "bg-background shadow text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CameraIcon size={16} />
          Camera
        </button>
        <button
          id="scan-tab-upload"
          onClick={() => onModeChange("upload")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            mode === "upload"
              ? "bg-background shadow text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UploadIcon size={16} />
          Upload
        </button>
      </div>

      {/* Camera mode */}
      {mode === "camera" && (
        <Card className="p-0 w-full aspect-[3/4] md:aspect-video overflow-hidden border-2">
          <CardContent
            className={`p-0 h-full w-full relative ${isProcessing ? "pointer-events-none" : ""}`}
          >
              {/* Idle state: clickable mockup to start camera */}
              {(cameraState === "idle" || cameraState === "error") && (
                <button
                  id="scan-open-camera-btn"
                  onClick={onStartCamera}
                  disabled={isProcessing}
                  className="flex flex-col items-center justify-center h-full w-full gap-3 cursor-pointer hover:bg-muted/50 transition-colors px-6"
                >
                  <div
                    className={`rounded-full p-6 border-2 transition-colors ${
                      cameraState === "error"
                        ? "bg-destructive/10 border-destructive/30 hover:border-destructive/60"
                        : "bg-primary/10 border-primary/20 hover:border-primary/50"
                    }`}
                  >
                    <CameraIcon
                      size={52}
                      className={cameraState === "error" ? "text-destructive" : "text-primary"}
                    />
                  </div>
                  <p className="text-base font-medium">
                    {cameraState === "error" ? "Tap to retry" : "Tap to open camera"}
                  </p>
                  {cameraState === "error" && cameraError && (
                    <p className="text-sm text-muted-foreground text-center">
                      {cameraErrorMessage(cameraError)}
                    </p>
                  )}
                </button>
              )}

              {/* Starting state */}
              {cameraState === "starting" && (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Spinner className="size-8" />
                  <p className="text-base">Opening camera...</p>
                </div>
              )}

              {/* Active: live video */}
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${
                  cameraState === "active" ? "block" : "hidden"
                }`}
                autoPlay
                playsInline
                muted
              />

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
                  <Spinner className="size-8" />
                  <p className="text-white mt-2 text-center px-4">
                    {loadingMessage || (progress > 0 ? `Analyzing... ${progress}%` : "Preparing...")}
                  </p>
                </div>
              )}

              {/* Bottom controls when camera is active */}
              {cameraState === "active" && (
                <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-5 bg-linear-to-t from-black/70 to-transparent">
                  {cameraList.length > 1 && (
                    <Select
                      value={selectedCamera || ""}
                      onValueChange={(value) => onSwitchCamera(value)}
                    >
                      <SelectTrigger className="w-full bg-background/80 backdrop-blur">
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {cameraList.map((cam) => (
                            <SelectItem key={cam.deviceId} value={cam.deviceId}>
                              <span className="flex items-center gap-2">
                                <span>
                                  {cam.facing === "environment"
                                    ? "📷"
                                    : cam.facing === "user"
                                      ? "🤳"
                                      : "📸"}
                                </span>
                                <span className="truncate">{cam.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}

                  <Button
                    id="scan-capture-btn"
                    size="lg"
                    className="w-full"
                    onClick={onCapture}
                    disabled={isProcessing}
                  >
                    <CameraIcon /> Capture Bill
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Upload mode */}
      {mode === "upload" && (
        <Card className="p-0 w-full aspect-[3/4] md:aspect-video overflow-hidden border-2">
          <CardContent className={`p-0 h-full w-full relative ${isProcessing ? "pointer-events-none" : ""}`}>
              <button
                id="scan-upload-area"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex flex-col items-center justify-center h-full w-full gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-full bg-primary/10 p-6 border-2 border-dashed border-primary/40 hover:border-primary/70 transition-colors">
                  <UploadIcon size={52} className="text-primary" />
                </div>
                <p className="text-base font-medium">Tap to upload receipt</p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, WEBP supported
                </p>
              </button>

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
                  <Spinner className="size-8" />
                  <p className="text-white mt-2 text-center px-4">
                    {loadingMessage || (progress > 0 ? `Analyzing... ${progress}%` : "Preparing...")}
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          // Reset so same file can be re-selected
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default CameraView;
