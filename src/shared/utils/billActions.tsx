import BillExportCard from "@/features/bill/components/BillExportCard";
import { BillProps } from "@/features/bill/types/bill";
import { toJpeg } from "html-to-image";
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
