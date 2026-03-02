import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentBill } from "@/stores/selectors/bill.selectors";
import { useDataStore } from "@/stores/useDataStore";

const BillChargesSection = () => {
  const bill = useCurrentBill();
  const updateCharges = useDataStore((state) => state.updatePeopleCharges);

  if (!bill) return null;

  const { taxPercent, servicePercent } = bill.charges;

  return (
    <div className="space-y-3 w-full">
      <p className="text-base font-medium">Additional Charges</p>

      <div className="flex gap-4">
        <div className="space-y-3 w-full">
          <Label htmlFor="tax">Tax (%)</Label>
          <Input
            type="number"
            id="tax"
            value={taxPercent}
            onChange={(e) =>
              updateCharges({ taxPercent: Number(e.target.value) })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="space-y-3 w-full">
          <Label htmlFor="service">Service (%)</Label>
          <Input
            type="number"
            id="service"
            value={servicePercent}
            onChange={(e) =>
              updateCharges({ servicePercent: Number(e.target.value) })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BillChargesSection;
