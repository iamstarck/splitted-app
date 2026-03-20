import { useEffect, useRef, useState } from "react";

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [cameraState, setCameraState] = useState<"idle" | "active" | "error">(
    "idle",
  );
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");

  useEffect(() => {
    let stream: MediaStream;
    const videoElement = videoRef.current;

    const startCamera = async (deviceId?: string) => {
      try {
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: "environment" },
        });

        if (videoElement) {
          videoElement.srcObject = stream;
          await videoElement.play();
        }

        setCameraState("active");
      } catch {
        setCameraState("error");
      }
    };

    const init = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      setCameraList(cams);

      if (cams.length > 0 && !selectedCamera) {
        setSelectedCamera(cams[0].deviceId);
        startCamera(cams[0].deviceId);
      }
    };

    init();
    if (selectedCamera) startCamera(selectedCamera);

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [selectedCamera]);

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
    cameraList,
    selectedCamera,
    setSelectedCamera,
    capture,
  };
};
