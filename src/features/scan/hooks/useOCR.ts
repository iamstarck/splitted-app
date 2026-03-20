import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

export const useOCR = (image: string | null) => {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!image) return;

    let active = true;

    const run = async () => {
      setIsProcessing(true);

      const worker = await createWorker("eng");
      const res = await worker.recognize(image);

      if (active) setText(res.data.text);

      await worker.terminate();
      setIsProcessing(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [image]);

  return { text, isProcessing };
};
