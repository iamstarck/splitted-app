import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import AvatarInitials from "@/shared/components/AvatarInitials";

const BillListItem = () => {
  return (
    <Item variant={"muted"}>
      <ItemContent className="gap-4">
        <div className="flex justify-between text-left gap-8">
          <div>
            <p className="text-lg font-bold leading-none">Dinner</p>
            <p className="text-base">01 Jan 2026</p>
          </div>
          <p className="font-bold text-xl text-chart-1">Rp50.000</p>
        </div>

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          <AvatarInitials name="CN" />
          <AvatarInitials name="LR" />
          <AvatarInitials name="ER" />
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
