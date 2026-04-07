import { ModeToggle } from "@/components/common/ModeToggle";
import BackButton from "@/shared/components/BackButton";
import Footer from "@/shared/components/Footer";
import HelpGuide from "@/shared/components/HelpGuide";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CameraView from "@/features/scan/components/CameraView";
import { useCamera } from "@/features/scan/hooks/useCamera";
import { useOCR } from "@/features/scan/hooks/useOCR";
import { preprocessImage } from "@/features/scan/utils/imagePreprocessor";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/stores/useDataStore";
import { initialBill } from "@/features/bill/types/bill";
import { generateId } from "@/shared/utils/utils";
import PageTransition from "@/shared/animations/PageTransition";
import { motion } from "framer-motion";

const ScanBillPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const setCurrentBill = useDataStore((state) => state.setCurrentBill);

  const {
    videoRef,
    cameraState,
    cameraError,
    cameraList,
    selectedCamera,
    startCamera,
    switchCamera,
    capture,
  } = useCamera();

  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleDone = useCallback(() => setIsProcessing(false), []);
  
  const { data: parsed, progress, loadingMessage, status } = useOCR(image, handleDone);

  const processImage = async (raw: string) => {
    setIsProcessing(true);
    try {
      const processed = await preprocessImage(raw);
      setImage(processed);
    } catch {
      setImage(raw);
    }
  };

  const handleCapture = async () => {
    const img = capture();
    if (!img) return;
    await processImage(img);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw = e.target?.result as string;
      if (raw) await processImage(raw);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBill = () => {
    if (!parsed) return;

    const newBill = initialBill();
    newBill.title = "Scanned Receipt";

    if (parsed.items && parsed.items.length > 0) {
        newBill.items = parsed.items.map((item) => ({
          id: generateId(),
          name: item.name,
          price: item.price,
          assignedPersonIds: [],
        }));
    }

    const subtotal = parsed.subtotal || parsed.items?.reduce((acc, item) => acc + item.price, 0) || 0;

    if (subtotal > 0) {
      if (parsed.tax) {
        newBill.charges.taxPercent = Number(((parsed.tax / subtotal) * 100).toFixed(2));
      }
      // Service charges are less consistently separated in standard receipts, but handled if exists
    }

    setCurrentBill(newBill);
    navigate("/new", { state: { fromScan: true } });
  };

  return (
    <PageTransition>
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl justify-between">
        <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
          <div className="flex items-center justify-between w-full">
            <BackButton onClick={() => navigate("/")} />
            <div className="flex items-center gap-4 max-md:gap-2">
              <HelpGuide />
              <ModeToggle />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold">Scan Bill</h1>
            <p className="text-base text-muted-foreground">
              {mode === "camera"
                ? "Point your camera at the receipt"
                : "Upload a photo of your receipt"}
            </p>
          </div>
        </header>

        <main className="flex flex-col justify-center p-6 w-full gap-6 h-full">
          <CameraView
            videoRef={videoRef}
            cameraState={cameraState}
            cameraError={cameraError}
            cameraList={cameraList}
            selectedCamera={selectedCamera}
            onStartCamera={startCamera}
            onSwitchCamera={switchCamera}
            onCapture={handleCapture}
            onUpload={handleUpload}
            isProcessing={isProcessing}
            progress={progress}
            loadingMessage={loadingMessage}
            mode={mode}
            onModeChange={setMode}
          />

          {parsed && parsed.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border mt-4">
              <h2 className="text-xl font-semibold">Berhasil mengekstrak Struk!</h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-medium border-b border-border pb-2">
                  <span>{parsed.items.length} items found</span>
                  <span>{parsed.subtotal || parsed.items.reduce((s, i) => s + i.price, 0).toLocaleString()}</span>
                </div>
                {parsed.tax && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>{parsed.tax.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <Button onClick={handleCreateBill} className="w-full mt-4" size="lg">
                Edit & Lanjut Assign 
              </Button>
            </motion.div>
          )}

          {status === "done" && parsed && parsed.items.length === 0 && (
            <div className="flex flex-col gap-4 bg-muted/50 p-6 rounded-xl border border-warning mt-4">
              <h2 className="text-lg font-semibold text-warning">Ditemukan Struk (Kosong)</h2>
              <p className="text-sm">Struk terbaca tetapi kami tidak bisa menemukan detail nama & harga barang. Anda harus memasukkannya manual ke bill Anda.</p>
              <Button onClick={handleCreateBill} className="w-full mt-4" size="lg" variant="secondary">
                Lanjutkan Isi Manual
              </Button>
            </div>
          )}
          
          {status === "error" && (
            <div className="flex flex-col gap-4 bg-muted/50 p-6 rounded-xl border border-destructive mt-4">
              <h2 className="text-lg font-semibold text-destructive">Gagal membaca struk</h2>
              <p className="text-sm">Pastikan foto lebih fokus, terang, tidak buram dan pastikan Server Vercel berjalan.</p>
              <p className="text-xs text-destructive font-mono bg-destructive/10 p-2 rounded">{loadingMessage}</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
    </PageTransition>
  );
};

export default ScanBillPage;
