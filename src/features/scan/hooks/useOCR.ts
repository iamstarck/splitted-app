import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

export const useOCR = (image: string | null, onDone?: () => void) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!image) return;

    let active = true;

    const run = async () => {
      const worker = await createWorker("eng");
      const res = await worker.recognize(image);
      if (active) setText(res.data.text);

      await worker.terminate();
      onDone?.();
    };

    run();

    return () => {
      active = false;
    };
  }, [image, onDone]);

  return { text };
};
