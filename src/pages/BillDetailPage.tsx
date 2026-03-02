import { ModeToggle } from "@/components/common/ModeToggle";
import BackButton from "../shared/components/BackButton";
import Footer from "../shared/components/Footer";
import BillSplittedSummary from "@/features/bill/components/BillSplittedSummary";
import { Button } from "@/components/ui/button";
import { DownloadIcon, EllipsisVerticalIcon, Share2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBillById } from "@/stores/selectors/bill.selectors";
import { useEffect, useMemo } from "react";
import { buildBillSummary } from "@/features/bill/lib/bill.calculation";
import { formatDate } from "@/features/home/utils/formatTime";

const BillDetailPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const bill = useBillById(billId);

  useEffect(() => {
    if (!billId) {
      navigate("/");
      return;
    }
    if (!bill) {
      navigate("/");
      return;
    }
  }, [billId, bill, navigate]);

  const summary = useMemo(() => {
    if (!bill) return null;
    return buildBillSummary(bill);
  }, [bill]);

  const hasNote = bill?.note?.trim() ?? "";

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 justify-between">
        <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
          <div className="flex items-center justify-between w-full">
            <BackButton onClick={() => navigate("/")} />
            <ModeToggle />
          </div>

          <div className="flex justify-between items-center">
            <h1 className="lg:text-4xl max-md:text-3xl font-bold">
              Bill Detail
            </h1>
            {(bill || summary) && (
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <EllipsisVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/edit/${billId}`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </header>

        <main className="flex flex-col justify-start items-center p-6 w-full min-h-screen">
          <div className="space-y-6 w-full">
            {!bill || !summary ? (
              <p>Loading bill data...</p>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-semibold">
                    Bill Name: {bill.title}
                  </h2>
                  <p className="font-semibold">
                    Date:{" "}
                    <span className="font-normal">
                      {formatDate(new Date(bill.date))}
                    </span>
                  </p>
                </div>

                {hasNote && (
                  <div>
                    <h2 className="text-xl font-semibold">Note</h2>
                    <p className="whitespace-pre-line">{bill.note}</p>
                  </div>
                )}

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
