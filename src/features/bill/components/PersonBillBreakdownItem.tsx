import { Item, ItemContent, ItemHeader } from "@/components/ui/item";
import AvatarInitials from "@/shared/components/AvatarInitials";
import type { AmountPerPerson, currencyId, ItemProps } from "../types/bill";
import { formatter } from "@/shared/utils/utils";

type PersonBillBreakdownItemProps = {
  person: AmountPerPerson;
  currency?: currencyId;
  items: ItemProps[];
};

const PersonBillBreakdownItem = ({
  person,
  currency,
  items,
}: PersonBillBreakdownItemProps) => {
  const chargeShare = person.total - person.subtotal;

  return (
    <Item variant={"muted"}>
      <ItemHeader>
        <div className="flex items-center gap-2">
          <AvatarInitials name={person.name} />

          <p>{person.name}</p>
        </div>

        <p className="text-lg font-bold text-accent-foreground">
          {currency}
          {formatter.format(person.total)}
        </p>
      </ItemHeader>

      <ItemContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between ml-10">
            <p className="text-sm">Items:</p>
            <p className="text-sm">
              {currency}
              {formatter.format(person.subtotal)}
            </p>
          </div>

          <div className="ml-10">
            <ol className="list-decimal list-inside">
              {items.map((item) => (
                <li key={item.id} className="text-sm font-medium text-primary">
                  {item.name}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {chargeShare > 0 && (
          <div>
            <div className="flex justify-between ml-10">
              <p className="text-sm">Additional Charges:</p>
              <p className="text-sm">
                {currency}
                {formatter.format(chargeShare)}
              </p>
            </div>
          </div>
        )}
      </ItemContent>
    </Item>
  );
};

export default PersonBillBreakdownItem;
