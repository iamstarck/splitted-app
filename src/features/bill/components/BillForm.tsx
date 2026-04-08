import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import BillSplittedSummary from "./BillSplittedSummary";
import BillMetaSection from "./sections/BillMetaSection";
import BillPeopleSection from "./sections/BillPeopleSection";
import BillItemsSection from "./sections/BillItemsSection";
import BillChargesSection from "./sections/BillChargesSection";
import { ReceiptIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCurrentBill,
  useSelectBillItems,
  useSelectPeople,
} from "@/stores/selectors/bill.selectors";
import { useWatch } from "react-hook-form";
import { useDataStore } from "@/stores/useDataStore";
import { useBillMetaForm } from "../hooks/useBillMetaForm";
import { useMemo } from "react";
import { buildBillSummary } from "../lib/bill.calculation";
import { toast } from "sonner";
import type { BillMetaFormValues } from "../lib/billMeta-validation";
import { useNavigate } from "react-router-dom";
import BackButton from "@/shared/components/BackButton";
import { ModeToggle } from "@/components/common/ModeToggle";
import Footer from "@/shared/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type BillFormProps = {
  mode: "create" | "edit";
  title: string;
  description: string;
};

const BillForm = ({ mode, title, description }: BillFormProps) => {
  const navigate = useNavigate();

  const currentBill = useCurrentBill()!;
  const initialValues =
    mode === "edit" && currentBill
      ? {
          title: currentBill.title,
          note: currentBill.note,
          currency: currentBill.currency,
          date: new Date(currentBill.date),
        }
      : undefined;

  const { form: billForm } = useBillMetaForm(initialValues);

  const people = useSelectPeople() ?? [];
  const items = useSelectBillItems() ?? [];

  const summary = useMemo(() => {
    if (!currentBill) return null;

    return buildBillSummary(currentBill);
  }, [currentBill]);

  const updateBillMeta = useDataStore((state) => state.updateBillMeta);
  const saveCurrentBill = useDataStore((state) => state.saveCurrentBill);
  const updateExistingBill = useDataStore((state) => state.updateExistingBill);
  const resetBill = useDataStore((state) => state.resetCurrentBill);

  const { isValid, isDirty } = billForm.formState;

  const handleCancel = () => {
    resetBill();
    billForm.reset();
    navigate("/");
  };

  const peopleJustOne = people.length === 1;

  const isButtonDisabled =
    !isValid ||
    peopleJustOne ||
    items.length === 0 ||
    !summary ||
    !summary.allAssigned ||
    !summary.isBalanced ||
    summary.hasUnassignedPeople;

  const currency = useWatch({
    control: billForm.control,
    name: "currency",
  });

  const onSaveBill = (data: BillMetaFormValues) => {
    updateBillMeta({
      ...data,
      date: data.date.toISOString(),
    });

    switch (mode) {
      case "edit":
        updateExistingBill();
        toast.success("Bill updated successfully!", { position: "top-center" });
        navigate(`/detail/${currentBill.id}`);
        break;

      case "create":
        saveCurrentBill();
        toast.success("Bill created successfully!", { position: "top-center" });
        break;
    }

    resetBill();
    billForm.reset();
  };

  const showPlaceholder = people.length === 0 || items.length === 0;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 justify-between">
        <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
          <div className="flex items-center justify-between w-full">
            {mode === "edit" ? (
              isDirty ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <BackButton />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have unsaved changes. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Stay</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel}>
                        Leave
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <BackButton onClick={handleCancel} />
              )
            ) : (
              <BackButton onClick={() => navigate("/")} />
            )}
            <ModeToggle />
          </div>

          <div>
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="text-base">{description}</p>
          </div>
        </header>

        <main className="flex flex-col justify-center items-center p-6 w-full">
          <form
            className="flex flex-col items-center gap-8 w-full max-w-2xl"
            onSubmit={billForm.handleSubmit(onSaveBill)}
          >
            <BillMetaSection form={billForm} />
            <BillPeopleSection />
            <BillItemsSection currency={currency} />
            <BillChargesSection />
            {peopleJustOne && items.length > 0 && (
              <p className="text-destructive text-center">
                ⚠️ Why using this app if just split for one person?
              </p>
            )}
            {showPlaceholder && (
              <EmptyListPlaceholder
                icon={<ReceiptIcon size={90} />}
                message="Add people and add items to start splitting!"
              />
            )}
            {!showPlaceholder && !peopleJustOne && (
              <BillSplittedSummary bill={currentBill} currency={currency} />
            )}
            {mode === "create" && (
              <Button className="w-full" disabled={isButtonDisabled}>
                <SaveIcon /> Save Bill
              </Button>
            )}
            {mode === "edit" && (
              <div className="flex justify-center gap-4 w-full md:max-w-2xs max-w-40">
                {isDirty ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="secondary"
                        type="button"
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You have unsaved changes. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Stay</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>
                          Leave
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button
                    variant="secondary"
                    type="button"
                    className="w-full"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}

                <Button className="w-full" disabled={isButtonDisabled}>
                  <SaveIcon /> Update Bill
                </Button>
              </div>
            )}
          </form>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default BillForm;
