import BillExportCard from "@/features/bill/components/BillExportCard";
import BillShareCard from "@/features/bill/components/BillShareCard";
import { BillProps } from "@/features/bill/types/bill";
import { toJpeg, toPng } from "html-to-image";
import { createRoot } from "react-dom/client";
import { toast } from "sonner";

const copyBillNoteToClipboard = async (bill: BillProps) => {
  try {
    if (!bill?.note) return;

    const textToCopy = `${bill.note}\n\nSplit with Splitted\nhttps://splitted.vercel.app/`;

    await navigator.clipboard.writeText(textToCopy);
    toast.info("Note copied to clipboard", { position: "top-center" });
  } catch (err) {
    console.error("Failed to copy text: ", err);
    toast.error(`${err}`, { position: "top-center" });
  }
};

export const downloadBill = async (bill: BillProps) => {
  try {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <div className="w-full p-6 bg-primary-foreground">
        <div className="p-4 border-2 border-dashed border-accent-foreground">
          <BillExportCard bill={bill!} currency={bill!.currency} />
        </div>
      </div>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const dataUrl = await toJpeg(container, {
      cacheBust: true,
      pixelRatio: 2,
    });

    root.unmount();
    document.body.removeChild(container);

    const link = document.createElement("a");
    link.download = `${bill?.title ?? "bill"}-bill.jpeg`;
    link.href = dataUrl;
    link.click();
    toast.success("Bill downloaded successfully!", {
      position: "top-center",
    });
    copyBillNoteToClipboard(bill);
  } catch (err) {
    console.log(err);
    toast.error(`${err}`, { position: "top-center" });
  }
};

/**
 * Generate a simple, minimal share image of the bill (receipt style).
 * Returns a PNG data URL, or null on failure.
 */
export const generateShareImage = async (bill: BillProps): Promise<string | null> => {
  try {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.width = "360px"; // Match card width
    container.style.backgroundColor = "#ffffff";
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<BillShareCard bill={bill} currency={bill.currency} />);

    // Wait for React to flush + fonts + next paint
    await new Promise((resolve) => setTimeout(resolve, 300));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    // Capture the first child (the actual card) to avoid container issues
    const target = container.firstChild as HTMLElement || container;

    const dataUrl = await toPng(target, {
      cacheBust: true,
      pixelRatio: 3, // Higher quality
      backgroundColor: "#ffffff",
    });

    root.unmount();
    document.body.removeChild(container);

    return dataUrl;
  } catch (err) {
    console.error("Share image generation failed:", err);
    return null;
  }
};

/**
 * Download the minimal share card as a PNG image.
 */
export const shareBillAsImage = async (bill: BillProps) => {
  const dataUrl = await generateShareImage(bill);
  if (!dataUrl) {
    toast.error("Gagal membuat gambar share.", { position: "top-center" });
    return;
  }

  // Use Web Share API if available (mobile), else download
  if (navigator.share) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${bill.title ?? "bill"}-split.png`, { type: "image/png" });
      await navigator.share({
        title: `Split Bill: ${bill.title}`,
        files: [file],
      });
    } catch {
      // User cancelled share or not supported, fall back to download
      downloadDataUrl(dataUrl, bill.title);
    }
  } else {
    downloadDataUrl(dataUrl, bill.title);
    toast.success("Gambar berhasil didownload!", { position: "top-center" });
  }
};

const downloadDataUrl = (dataUrl: string, title?: string) => {
  const link = document.createElement("a");
  link.download = `${title ?? "bill"}-split.png`;
  link.href = dataUrl;
  link.click();
};
