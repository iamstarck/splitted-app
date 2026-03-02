import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import AvatarInitials from "@/shared/components/AvatarInitials";
import { XIcon } from "lucide-react";
import type { currencyId, ItemProps } from "../../types/bill";
import { useDataStore } from "@/stores/useDataStore";
import { formatter } from "@/shared/utils/utils";
import {
  useSelectItemPricePerPerson,
  useSelectPeople,
} from "@/stores/selectors/bill.selectors";

interface BillItemProps {
  currency?: currencyId;
  item: ItemProps;
}

const BillItem = ({ currency, item }: BillItemProps) => {
  const removeItem = useDataStore((state) => state.removeItemFromBill);
  const assignItemToPeople = useDataStore((state) => state.assignItemToPeople);

  const people = useSelectPeople() ?? [];
  const pricePerPerson = useSelectItemPricePerPerson(item.id);

  return (
    <Item variant={"muted"}>
      <ItemHeader className="items-start">
        <div>
          <ItemTitle>{item.name}</ItemTitle>
          <p className="font-semibold text-lg text-accent-foreground">
            {currency} {formatter.format(item.price)}
          </p>
        </div>
        <ItemActions>
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={() => removeItem(item.id)}
          >
            <XIcon />
          </Button>
        </ItemActions>
      </ItemHeader>

      {people.length > 0 && (
        <ItemContent>
          <p className="text-sm mb-1">Assign to</p>

          <ToggleGroup
            type="multiple"
            spacing={2}
            className="flex-wrap"
            value={item.assignedPersonIds}
            onValueChange={(values) => assignItemToPeople(item.id, values)}
          >
            {people.map((person) => (
              <ToggleGroupItem
                key={person.id}
                value={person.id}
                aria-label={`Toggle ${person.name}`}
              >
                <div className="flex items-center gap-2">
                  <AvatarInitials name={person.name} />

                  <p>{person.name}</p>
                </div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {item.assignedPersonIds.length > 1 && (
            <p className="text-sm text-muted-foreground">
              <span>
                {currency}
                {pricePerPerson ? formatter.format(pricePerPerson) : ""}
              </span>{" "}
              per person
            </p>
          )}
        </ItemContent>
      )}
    </Item>
  );
};

export default BillItem;
