import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import BillSplittedSummary from "./BillSplittedSummary";
import BillChargesSection from "./sections/BillChargesSection";
import BillItemsSection from "./sections/BillItemsSection";
import BillMetaSection from "./sections/BillMetaSection";
import BillPeopleSection from "./sections/BillPeopleSection";
import { ReceiptIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewBillForm = () => {
  return (
    <form className="space-y-8 w-full">
      <BillMetaSection />
      <BillPeopleSection />
      <BillItemsSection />
      <div className="hidden">
        <BillChargesSection />
      </div>

      <BillSplittedSummary />

      <EmptyListPlaceholder
        icon={<ReceiptIcon size={90} />}
        message="Add people and add items to start splitting!"
      />

      <Button className="w-full">
        <SaveIcon /> Save Bill
      </Button>
    </form>
  );
};

export default NewBillForm;
