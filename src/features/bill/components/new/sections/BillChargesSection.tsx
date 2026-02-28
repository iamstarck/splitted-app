import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BillChargesSection = () => {
  return (
    <div className="space-y-3 w-full">
      <p className="text-base font-medium">Additional Charges</p>

      <div className="flex gap-4">
        <div className="space-y-3 w-full">
          <Label htmlFor="tax">Tax (%)</Label>
          <Input type="number" placeholder="0" id="tax" />
        </div>
        <div className="space-y-3 w-full">
          <Label htmlFor="service">Service (%)</Label>
          <Input type="number" placeholder="0" id="service" />
        </div>
        <div className="space-y-3 w-full">
          <Label htmlFor="tip">Tip (%)</Label>
          <Input type="number" placeholder="0" id="tip" />
        </div>
      </div>
    </div>
  );
};

export default BillChargesSection;
