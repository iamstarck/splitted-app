import { Button } from "@/components/ui/button";
import { Item, ItemActions } from "@/components/ui/item";
import AvatarInitials from "@/shared/components/AvatarInitials";
import { XIcon } from "lucide-react";

const PersonItem = () => {
  return (
    <Item variant={"muted"} className="justify-between py-1">
      <div className="flex items-center gap-2">
        <AvatarInitials name={"User"} className="w-10 h-10" />

        <p>User</p>
      </div>
      <ItemActions>
        <Button type="button" variant={"ghost"} size={"sm"}>
          <XIcon />
        </Button>
      </ItemActions>
    </Item>
  );
};

export default PersonItem;
