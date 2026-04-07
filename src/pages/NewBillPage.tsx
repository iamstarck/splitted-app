import BillForm from "@/features/bill/components/BillForm";
import { useDataStore } from "@/stores/useDataStore";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NewBillPage = () => {
  const resetBill = useDataStore((state) => state.resetCurrentBill);
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.fromScan) {
      resetBill();
    }
  }, [resetBill, location.state]);

  return (
    <BillForm
      mode="create"
      title="New Bill"
      description="Create and split new bill"
    />
  );
};

export default NewBillPage;
