import BillForm from "@/features/bill/components/BillForm";
import {
  useBills,
  useCurrentBill,
  useSetCurrentBillById,
} from "@/stores/selectors/bill.selectors";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBillPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const setCurrentBillById = useSetCurrentBillById();
  const bills = useBills();
  const currentBill = useCurrentBill();

  useEffect(() => {
    if (!billId) {
      navigate("/");

      return;
    }

    const exists = bills.some((bill) => bill.id === billId);
    if (!exists) {
      navigate("/");

      return;
    }

    setCurrentBillById(billId);
  }, [billId, bills, navigate, setCurrentBillById]);

  if (!currentBill || currentBill.id !== billId) {
    return <p>Loading bill data...</p>;
  }
  return (
    <BillForm
      mode="edit"
      title="Edit Bill"
      description="Update your existing bill"
    />
  );
};

export default EditBillPage;
