import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import PersonBillBreakdownItem from "@/features/new-bill/components/PersonBillBreakdownItem";
import { formatter } from "@/shared/utils/utils";
import { useCurrentBill } from "@/stores/selectors/bill.selectors";
import { useMemo } from "react";
import { buildBillSummary } from "../lib/bill.calculation";
import type { currencyId } from "../types/bill";

const BillSplittedSummary = ({ currency }: { currency: currencyId }) => {
  const currentBill = useCurrentBill()!;

  const summary = useMemo(() => {
    if (!useCurrentBill) return null;

    return buildBillSummary(currentBill);
  }, [currentBill]);
  if (!summary) return null;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="pb-2 border-b-2 space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <span>
              {currency}
              {formatter.format(summary.subtotal.toNumber())}
            </span>
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
          <p className="text-xl font-bold">
            {currency}
            {formatter.format(summary.total.toNumber())}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {!summary.allAssigned && (
          <p className="text-destructive">
            ⚠️ All items must be assigned to people before splitting.
          </p>
        )}

        {summary.allAssigned && summary.hasUnassignedPeople && (
          <p className="text-destructive">
            ⚠️ Why put someone on the list if they don't pay the split?
          </p>
        )}

        {summary.allAssigned && !summary.isBalanced && (
          <p className="text-destructive">
            ⚠️ Split mismatch. Assigned totals do not equal item totals.
          </p>
        )}

        <div className="pt-4 border-t-2 space-y-2">
          <p className="font-semibold">Per Person Breakdown</p>
          <ItemGroup className="space-y-3">
            {summary?.perPerson.map((person) => (
              <PersonBillBreakdownItem
                key={person.personId}
                person={{
                  ...person,
                  subtotal: person.subtotal.toNumber(),
                  total: person.total.toNumber(),
                }}
                currency={currency}
                items={summary.groupedByPerson[person.personId] ?? []}
              />
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillSplittedSummary;
