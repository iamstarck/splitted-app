import { ModeToggle } from "@/components/common/ModeToggle";
import BackButton from "@/shared/components/BackButton";
import Footer from "@/shared/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CameraView from "@/features/scan/components/CameraView";
import { useCamera } from "@/features/scan/hooks/useCamera";
import { useOCR } from "@/features/scan/hooks/useOCR";
import { parseReceipt } from "@/features/scan/utils/ScanTextUtils";

const ScanBillPage = () => {
  const navigate = useNavigate();

  const {
    videoRef,
    cameraState,
    cameraList,
    selectedCamera,
    setSelectedCamera,
    capture,
  } = useCamera();

  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { text } = useOCR(image, () => setIsProcessing(false));

  const handleCapture = () => {
    const img = capture();
    if (!img) return;

    setImage(img);
    setIsProcessing(true);
  };

  const parsed = text ? parseReceipt(text) : null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 justify-between">
        <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
          <div className="flex items-center justify-between w-full">
            <BackButton onClick={() => navigate("/")} />
            <ModeToggle />
          </div>

          <div>
            <h1 className="text-4xl font-bold">Scan Bill</h1>
            <p className="text-base">Position your bill within the frame</p>
          </div>
        </header>

        <main className="flex flex-col justify-center p-6 w-full gap-6 h-full">
          <CameraView
            videoRef={videoRef}
            cameraState={cameraState}
            cameraList={cameraList}
            selectedCamera={selectedCamera}
            setSelectedCamera={setSelectedCamera}
            onCapture={handleCapture}
            isProcessing={isProcessing}
          />

          <section>
            <h2 className="text-2xl font-semibold">RAW OCR</h2>
            <pre>{text}</pre>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Parsed Result</h2>
            {parsed && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ScanBillPage;
