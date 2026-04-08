import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentBill } from "@/stores/selectors/bill.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { useState } from "react";

const BillChargesSection = () => {
  const bill = useCurrentBill();
  const updateCharges = useDataStore((state) => state.updatePeopleCharges);

  if (!bill) return null;

  const { taxPercent, servicePercent } = bill.charges;

  const [displayTax, setDisplayTax] = useState(
    taxPercent === 0 ? "" : taxPercent.toString()
  );
  const [displayService, setDisplayService] = useState(
    servicePercent === 0 ? "" : servicePercent.toString()
  );

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validChars = e.target.value.replace(/[^0-9.]/g, "");
    const parts = validChars.split(".");
    const numericValue = parts[0] + (parts.length > 1 ? "." + parts[1] : "");

    setDisplayTax(numericValue);

    const num = Number(numericValue);
    if (!isNaN(num)) {
      updateCharges({ taxPercent: num });
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validChars = e.target.value.replace(/[^0-9.]/g, "");
    const parts = validChars.split(".");
    const numericValue = parts[0] + (parts.length > 1 ? "." + parts[1] : "");

    setDisplayService(numericValue);

    const num = Number(numericValue);
    if (!isNaN(num)) {
      updateCharges({ servicePercent: num });
    }
  };

  return (
    <div className="space-y-3 w-full">
      <p className="text-base font-medium">Additional Charges</p>

      <div className="flex gap-4">
        <div className="space-y-3 w-full">
          <Label htmlFor="tax">Tax (%)</Label>
          <Input
            type="text"
            id="tax"
            placeholder="0"
            value={displayTax}
            onChange={handleTaxChange}
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
            type="text"
            id="service"
            placeholder="0"
            value={displayService}
            onChange={handleServiceChange}
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
