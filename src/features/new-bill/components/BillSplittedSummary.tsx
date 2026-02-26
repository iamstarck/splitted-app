import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import PersonBillBreakdownItem from "@/features/new-bill/components/PersonBillBreakdownItem";

const BillSplittedSummary = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="pb-2 border-b-2 space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <span>$23.55</span>
          </div>
          {/* <div className="flex justify-between">
            <p>
              Tax (<span>2</span>%)
            </p>
            <span>Rp15000</span>
          </div>
          <div className="flex justify-between">
            <p>
              Service (<span>2</span>%)
            </p>
            <span>Rp15000</span>
          </div>
          <div className="flex justify-between">
            <p>
              Tip (<span>4</span>%)
            </p>
            <span>Rp5000</span>
          </div> */}
        </div>
        <div className="flex justify-between">
          <p className="text-lg font-bold">Total</p>
          <p className="text-xl font-bold">$23.55</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-destructive">
          ⚠️ All items must be assigned to people before splitting.
        </p>

        <p className="text-destructive">
          ⚠️ Split mismatch. Assigned totals do not equal item totals.
        </p>

        <div className="pt-4 border-t-2 space-y-2">
          <p className="font-semibold">Per Person Breakdown</p>
          <ItemGroup className="space-y-3">
            <PersonBillBreakdownItem />
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillSplittedSummary;
