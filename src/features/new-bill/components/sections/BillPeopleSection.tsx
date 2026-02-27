import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemGroup } from "@/components/ui/item";
import PersonItem from "@/features/new-bill/components/PersonItem";
import { useSelectPeople } from "@/stores/selectors/bill.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { PlusIcon, UsersIcon } from "lucide-react";
import { useState } from "react";

const BillPeopleSection = () => {
  const people = useSelectPeople() ?? [];
  const addPerson = useDataStore((state) => state.addPersonToBill);

  const [name, setName] = useState("");

  const handleAddPerson = () => {
    if (!name.trim()) return;

    console.log(useDataStore.getState().currentBill);
    addPerson(name);

    setName("");
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <UsersIcon />
          <p className="text-base font-medium">People</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          id="bill-title"
          placeholder="Input name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddPerson();
            }
          }}
        />

        <Button type="button" onClick={handleAddPerson}>
          <PlusIcon />
        </Button>
      </div>

      {people.length > 0 && (
        <ItemGroup className="mx-4 space-y-2">
          {people.map((person) => (
            <PersonItem key={person.id} person={person} />
          ))}
        </ItemGroup>
      )}
    </div>
  );
};

export default BillPeopleSection;
