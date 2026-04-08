import { useEffect, useState } from "react";

type OcrStatus = "idle" | "processing" | "done" | "error";

interface MindeeItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ParsedBillData {
  items: MindeeItem[];
  subtotal: number | null;
  tax: number | null;
  total: number | null;
}

export const useOCR = (image: string | null, onDone?: () => void) => {
  const [data, setData] = useState<ParsedBillData | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<OcrStatus>("idle");
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => {
    if (!image) return;

    let active = true;

    const run = async (attempt = 1) => {
      try {
        setStatus("processing");
        setProgress(30);
        setLoadingMessage("Mengirim ke Mindee Engine...");

        // Timeout 30 seconds for Mindee Vision
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("OCR Timeout")), 30000);
        });

        const fetchPromise = fetch('/api/ocr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image })
        });

        // Race between fetch and timeout
        const res = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as Response;

        if (!active) return;
        
        setProgress(70);
        setLoadingMessage("Membaca struk otomatis...");

        if (!res.ok) {
           const errData = await res.json().catch(() => ({}));
           throw new Error(errData.error || `HTTP Error ${res.status}`);
        }

        const responseData = await res.json();

        if (active) {
          setProgress(90);
          setLoadingMessage("Menyusun komponen barang...");
          
          setData({
             items: responseData.items || [],
             subtotal: responseData.subtotal || null,
             tax: responseData.tax || null,
             total: responseData.total || null,
          });

          setStatus("done");
          setProgress(100);
          
          // Let parsing UI show briefly
          setTimeout(() => {
              if (active) onDone?.();
          }, 800);
        }
      } catch (err: any) {
        console.error("[useOCR] Error:", err);
        if (err.message === "OCR Timeout" && attempt < 2) {
            if (active) setLoadingMessage("Timeout. Mengulangi proses OCR...");
            // Retry
            if (active) run(attempt + 1);
            return;
        }

        if (active) {
            setStatus("error");
            setLoadingMessage(err.message || "Terjadi kesalahan pada Mindee Server.");
            onDone?.(); // Call onDone even on error to stop loading
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [image, onDone]);

  // Backward compatibility alias for 'data' 
  // We rename 'text' to 'data' in ScanBillPage but export both if needed.
  return { data, progress, status, loadingMessage };
};
