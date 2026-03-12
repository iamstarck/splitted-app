import { MinusIcon } from "lucide-react";
import { AmountPerPerson, currencyId, ItemProps } from "../types/bill";
import { formatter } from "@/shared/utils/utils";

type PersonBillExportItemProps = {
  person: AmountPerPerson;
  currency?: currencyId;
  items: ItemProps[];
};

const PersonBillExportItem = ({
  person,
  currency,
  items,
}: PersonBillExportItemProps) => {
  const chargeShare = person.total - person.subtotal;

  return (
    <div className="space-y-4 not-last:pb-6 not-last:border-b not-last:border-dashed not-last:border-foreground">
      <div className="flex justify-between">
        <p className="inline-flex items-center gap-2 text-xl font-medium">
          {person.name}
        </p>
        <span className="text-2xl font-semibold">
          {currency}
          {formatter.format(person.total)}
        </span>
      </div>

      <div>
        <p className="inline-flex items-center gap-2">
          items <MinusIcon size={16} />
          <span className="font-medium">
            {currency}
            {formatter.format(person.subtotal)}
          </span>
        </p>
        <ol className="list-decimal list-inside">
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ol>
      </div>

      {chargeShare > 0 && (
        <div>
          <p className="inline-flex items-center gap-2 font-medium">
            Additional charge <MinusIcon size={16} />
            <span className="font-medium">
              {currency}
              {formatter.format(chargeShare)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonBillExportItem;
