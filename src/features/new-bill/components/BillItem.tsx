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

const BillItem = () => {
  return (
    <Item variant={"muted"}>
      <ItemHeader className="items-start">
        <div>
          <ItemTitle>Item 1</ItemTitle>
          <p className="font-semibold text-lg text-accent-foreground">$20,34</p>
        </div>
        <ItemActions>
          <Button size={"sm"} variant={"ghost"}>
            <XIcon />
          </Button>
        </ItemActions>
      </ItemHeader>

      <ItemContent>
        <p className="text-sm mb-1">Assign to</p>

        <ToggleGroup type="multiple" spacing={2} className="flex-wrap">
          <ToggleGroupItem value={"user2-id"}>
            <div className="flex items-center gap-2">
              <AvatarInitials name={"User 2"} />

              <p>"User 2"</p>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>

        <p className="text-sm text-muted-foreground">
          <span>$5.34</span> per person
        </p>
      </ItemContent>
    </Item>
  );
};

export default BillItem;
