import { ModeToggle } from "@/components/common/ModeToggle";
import BackButton from "../shared/components/BackButton";
import Footer from "../shared/components/Footer";
import BillSplittedSummary from "@/features/bill/components/common/BillSplittedSummary";
import { Button } from "@/components/ui/button";
import { DownloadIcon, EllipsisVerticalIcon, Share2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "react-router-dom";
import { useBillById } from "@/stores/selectors/bill.selectors";
import { useMemo } from "react";
import { buildBillSummary } from "@/features/bill/lib/bill.calculation";

const BillDetailPage = () => {
  const { billId } = useParams();
  const bill = useBillById(billId);

  const summary = useMemo(() => {
    if (!bill) return null;
    return buildBillSummary(bill);
  }, [bill]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 justify-between">
        <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
          <div className="flex items-center justify-between w-full">
            <BackButton />
            <ModeToggle />
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Bill Detail</h1>
            {(bill || summary) && (
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <EllipsisVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </header>

        <main className="flex flex-col justify-start items-center p-6 w-full min-h-screen">
          <div className="space-y-10 w-full">
            {!bill || !summary ? (
              <p>Bill not found</p>
            ) : (
              <>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Bill Title</h2>
                  <p>{bill.title}</p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Bill Summary</h2>

                  <BillSplittedSummary bill={bill} />
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-center gap-4">
                    <Button
                      variant={"ghost"}
                      size={"lg"}
                      className="flex items-center gap-1"
                    >
                      <DownloadIcon /> Download
                    </Button>

                    <Button
                      variant={"ghost"}
                      size={"lg"}
                      className="flex items-center gap-1"
                    >
                      <Share2Icon /> Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default BillDetailPage;
