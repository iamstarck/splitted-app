import BillForm from "@/features/bill/components/BillForm";
import { useDataStore } from "@/stores/useDataStore";
import { useEffect } from "react";

const NewBillPage = () => {
  const resetBill = useDataStore((state) => state.resetCurrentBill);

  useEffect(() => {
    resetBill();
  }, [resetBill]);

  return (
    <BillForm
      mode="create"
      title="New Bill"
      description="Create and split new bill"
    />
  );
};

export default NewBillPage;
