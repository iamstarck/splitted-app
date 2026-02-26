import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ItemGroup } from "@/components/ui/item";
import BillItem from "@/features/new-bill/components/BillItem";
import { CoffeeIcon, PlusIcon } from "lucide-react";

const BillItemsSection = () => {
  return (
    <div className="space-y-3 w-full">
      <div className="flex gap-2">
        <CoffeeIcon />
        <p className="text-base font-medium">Items</p>
      </div>

      <div className="space-y-3">
        <Input type="name" placeholder="Item description" />

        <div className="flex gap-2">
          <InputGroup>
            <InputGroupInput type="number" placeholder="0" min={0} />

            <InputGroupAddon>$</InputGroupAddon>
          </InputGroup>
          <Button type="button">
            <PlusIcon />
          </Button>
        </div>
      </div>

      <ItemGroup className="space-y-2">
        <BillItem />
      </ItemGroup>
    </div>
  );
};

export default BillItemsSection;
