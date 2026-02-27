import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import AvatarInitials from "@/shared/components/AvatarInitials";
import { formatDate } from "../utils/formatTime";
import type { currencyId, PersonProps } from "@/features/new-bill/types/bill";
import { formatter } from "@/shared/utils/utils";

interface BillListItemProps {
  title: string;
  createdAt: Date;
  currency: currencyId;
  total: number;
  people: PersonProps[];
}

const BillListItem = ({
  title,
  createdAt,
  currency,
  total,
  people,
}: BillListItemProps) => {
  return (
    <Item variant={"muted"}>
      <ItemContent className="gap-4">
        <div className="flex justify-between text-left gap-8">
          <div>
            <p className="text-lg font-bold leading-none">{title}</p>
            <p className="text-base">{formatDate(createdAt)}</p>
          </div>
          <p className="font-bold text-xl text-chart-1">
            {currency}
            {formatter.format(total)}
          </p>
        </div>

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {people.map((person) => (
            <AvatarInitials key={person.id} name={person.name} />
          ))}
        </div>
      </ItemContent>
      <ItemFooter>
        <ItemActions className="w-full justify-around">
          <Button variant={"link"} className="text-base">
            <PencilIcon /> Edit
          </Button>
          <Button variant={"link"} className="text-destructive text-base">
            <Trash2Icon /> Delete
          </Button>
        </ItemActions>
      </ItemFooter>
    </Item>
  );
};

export default BillListItem;
