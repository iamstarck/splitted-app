import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { CameraIcon } from "lucide-react";
import { RefObject } from "react";

type CameraViewProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraState: string;
  cameraList: MediaDeviceInfo[];
  selectedCamera: string;
  setSelectedCamera: (v: string) => void;
  onCapture: () => void;
  isProcessing: boolean;
};

const CameraView = ({
  videoRef,
  cameraState,
  cameraList,
  selectedCamera,
  setSelectedCamera,
  onCapture,
  isProcessing,
}: CameraViewProps) => {
  return (
    <AspectRatio ratio={9 / 16} className="w-full">
      <Card className="p-0 w-full h-full overflow-hidden">
        <CardContent
          className={`p-0 h-full relative ${isProcessing ? "pointer-events-none" : ""}`}
        >
          {cameraState !== "active" && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-lg">
              <CameraIcon size={60} className="text-muted-foreground" />
              {cameraState === "error"
                ? "Camera access denied"
                : "Point camera at receipt"}
            </div>
          )}

          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${
              cameraState === "active" ? "block" : "hidden"
            }`}
            autoPlay
            playsInline
            muted
          />

          {isProcessing && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-auto">
              <Spinner className="size-8" />
              <p className="text-white mt-2">Processing...</p>
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-5 bg-linear-to-t from-black/70 to-transparent">
            {cameraState === "active" && cameraList.length > 1 && (
              <Select
                value={selectedCamera || ""}
                onValueChange={(value) => setSelectedCamera(value)}
              >
                <SelectTrigger className="w-full bg-background/80 backdrop-blur">
                  <SelectValue placeholder="Camera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cameraList.map((cam, index) => (
                      <SelectItem key={cam.deviceId} value={cam.deviceId}>
                        {cam.label || `Camera ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={onCapture}
              disabled={cameraState !== "active" || isProcessing}
            >
              <CameraIcon /> Capture Bill
            </Button>
          </div>
        </CardContent>
      </Card>
    </AspectRatio>
  );
};

export default CameraView;
