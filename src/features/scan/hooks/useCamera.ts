import { useCallback, useRef, useState } from "react";

export type CameraFacing = "environment" | "user" | "unknown";

export type CameraDevice = {
  deviceId: string;
  label: string;
  facing: CameraFacing;
};

/**
 * Guesses the facing mode of a camera based on its label.
 * Browsers expose labels like "Back Camera", "FaceTime HD Camera", etc.
 */
const detectFacing = (label: string): CameraFacing => {
  const l = label.toLowerCase();
  if (l.includes("back") || l.includes("rear") || l.includes("environment")) {
    return "environment";
  }
  if (
    l.includes("front") ||
    l.includes("face") ||
    l.includes("facetime") ||
    l.includes("user") ||
    l.includes("selfie")
  ) {
    return "user";
  }
  return "unknown";
};

/**
 * Generates a human-readable label for a camera.
 */
const buildCameraLabel = (
  device: MediaDeviceInfo,
  index: number,
  facing: CameraFacing,
): string => {
  if (device.label) {
    // Return the browser-provided label (e.g. "FaceTime HD Camera (Built-in)")
    return device.label;
  }
  // Fallback when label is empty (before permission granted)
  if (facing === "environment") return `Back Camera ${index + 1}`;
  if (facing === "user") return `Front Camera ${index + 1}`;
  return `Camera ${index + 1}`;
};

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<
    "idle" | "starting" | "active" | "error"
  >("idle");
  const [cameraError, setCameraError] = useState<string>("");
  const [cameraList, setCameraList] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");

  /**
   * Starts a camera stream by deviceId.
   * If no deviceId is given, prefers the back camera if available,
   * otherwise falls back to any available camera.
   */
  const startCamera = useCallback(async (deviceId?: string) => {
    setCameraState("starting");
    setCameraError("");

    try {
      // Stop any existing tracks first
      streamRef.current?.getTracks().forEach((t) => t.stop());

      const videoElement = videoRef.current;

      let stream: MediaStream;

      if (deviceId) {
        // Specific camera requested — try exact first, then fall back
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } },
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { ideal: deviceId } },
          });
        }
      } else {
        // First time: 3-step fallback chain
        // Step 1: Try "ideal" environment (soft preference, won't throw OverconstrainedError)
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
          });
        } catch {
          // Step 2: Try with no constraints at all
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          } catch {
            // Step 3: Last resort — minimal constraints
            stream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            });
          }
        }
      }

      streamRef.current = stream;

      if (videoElement) {
        videoElement.srcObject = stream;
        await videoElement.play();
      }

      // Enumerate all cameras after permission is granted
      // (labels are only available after getUserMedia succeeds)
      const devices = await navigator.mediaDevices.enumerateDevices();
      const rawCams = devices.filter((d) => d.kind === "videoinput");

      const cams: CameraDevice[] = rawCams.map((d, i) => {
        const facing = detectFacing(d.label);
        return {
          deviceId: d.deviceId,
          label: buildCameraLabel(d, i, facing),
          facing,
        };
      });

      setCameraList(cams);

      // Track which camera is currently active from the stream
      const activeTrack = stream.getVideoTracks()[0];
      const activeSettings = activeTrack?.getSettings?.();
      const activeDeviceId = activeSettings?.deviceId ?? cams[0]?.deviceId ?? "";
      setSelectedCamera(deviceId ?? activeDeviceId);

      setCameraState("active");
    } catch (err) {
      const error = err as DOMException;
      const name = error?.name ?? "UnknownError";
      const message = error?.message ?? String(err);
      console.error("[useCamera] Failed to start camera:", name, message, err);
      setCameraError(name);
      setCameraState("error");
    }
  }, []);

  /**
   * Switch to a specific camera by deviceId.
   */
  const switchCamera = useCallback(
    async (deviceId: string) => {
      setSelectedCamera(deviceId);
      await startCamera(deviceId);
    },
    [startCamera],
  );

  /**
   * Stop camera and release device resources.
   */
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraState("idle");
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    return canvas.toDataURL("image/png");
  };

  return {
    videoRef,
    cameraState,
    cameraError,
    cameraList,
    selectedCamera,
    startCamera,
    switchCamera,
    stopCamera,
    capture,
  };
};
