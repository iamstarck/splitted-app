import { Button } from "@/components/ui/button";
import { Item, ItemActions } from "@/components/ui/item";
import AvatarInitials from "@/shared/components/AvatarInitials";
import { XIcon } from "lucide-react";
import type { PersonProps } from "../../features/bill/types/bill";

type PersonItemProps = {
  person: PersonProps;
  onAction?: (personId: string) => void;
};

const PersonItem = ({ person, onAction }: PersonItemProps) => {
  return (
    <Item variant={"muted"} className="justify-between py-1">
      <div className="flex items-center gap-2">
        <AvatarInitials name={person.name} className="w-10 h-10" />

        <p>{person.name}</p>
      </div>
      {onAction && (
        <ItemActions>
          <Button
            type="button"
            variant={"ghost"}
            size={"sm"}
            onClick={() => onAction(person.id)}
          >
            <XIcon />
          </Button>
        </ItemActions>
      )}
    </Item>
  );
};

export default PersonItem;
