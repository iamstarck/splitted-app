import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemGroup } from "@/components/ui/item";
import PersonItem from "@/features/new-bill/components/PersonItem";
import { PlusIcon, UsersIcon } from "lucide-react";

const BillPeopleSection = () => {
  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <UsersIcon />
          <p className="text-base font-medium">People</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input type="text" id="bill-title" placeholder="Input name" />

        <Button type="button">
          <PlusIcon />
        </Button>
      </div>

      <ItemGroup className="mx-4 space-y-2">
        <PersonItem />
      </ItemGroup>
    </div>
  );
};

export default BillPeopleSection;
