import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import BillSplittedSummary from "./BillSplittedSummary";
import BillChargesSection from "./sections/BillChargesSection";
import BillItemsSection from "./sections/BillItemsSection";
import BillMetaSection from "./sections/BillMetaSection";
import BillPeopleSection from "./sections/BillPeopleSection";
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

const NewBillForm = () => {
  const { form: billForm } = useBillMetaForm();
  const currentBill = useCurrentBill()!;

  const people = useSelectPeople() ?? [];
  const items = useSelectBillItems() ?? [];

  const summary = useMemo(() => {
    if (!currentBill) return null;

    return buildBillSummary(currentBill);
  }, [currentBill]);

  const updateBillMeta = useDataStore((state) => state.updateBillMeta);
  const saveBill = useDataStore((state) => state.saveCurrentBill);
  const resetBill = useDataStore((state) => state.resetCurrentBill);

  const { isValid } = billForm.formState;
  const peopleJustOne = people.length === 1;

  const isButtonDisabled =
    !isValid ||
    peopleJustOne ||
    items.length === 0 ||
    !summary ||
    !summary.allAssigned ||
    !summary.isBalanced;

  const currency = useWatch({
    control: billForm.control,
    name: "currency",
  });

  const onSaveBill = (data: BillMetaFormValues) => {
    updateBillMeta(data);
    saveBill();
    toast.success("Bill created successfully!", { position: "top-center" });
    resetBill();
    billForm.reset();
  };

  const showPlaceholder = people.length === 0 || items.length === 0;

  return (
    <form
      className="space-y-8 w-full"
      onSubmit={billForm.handleSubmit(onSaveBill)}
    >
      <BillMetaSection form={billForm} />
      <BillPeopleSection />
      <BillItemsSection currency={currency} />
      <div className="hidden">
        <BillChargesSection />
      </div>

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
        <BillSplittedSummary currency={currency} />
      )}

      <Button className="w-full" disabled={isButtonDisabled}>
        <SaveIcon /> Save Bill
      </Button>
    </form>
  );
};

export default NewBillForm;
