import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import PersonItem from "../../../../shared/components/PersonItem";
import { useSelectPeople } from "@/stores/selectors/bill.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { PlusIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useSelectFriend } from "@/stores/selectors/friend.selectors";
import { useSelectProfile } from "@/stores/selectors/profile.selectors";
import { normalize } from "@/shared/utils/utils";

const BillPeopleSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const userProfile = useSelectProfile();
  const friendList = useSelectFriend();
  const people = useSelectPeople() ?? [];
  const availablePeople = [userProfile, ...friendList].filter(
    (person) =>
      !people.some((p) => normalize(p.name) === normalize(person.name)),
  );

  const addPerson = useDataStore((state) => state.addPersonToBill);
  const deletePerson = useDataStore((state) => state.removePersonFromBill);

  const [name, setName] = useState("");

  const handleAddPerson = () => {
    if (!name.trim()) return;

    addPerson(name);
    setName("");
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="person-name"
          className="flex gap-2 text-base font-medium"
        >
          <UsersIcon />
          <span>People</span>
        </Label>
      </div>

      <div className="flex gap-2">
        <Combobox
          items={availablePeople}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <ComboboxInput
            type="text"
            id="person-name"
            placeholder="Input name"
            value={name}
            className={"w-full"}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (isOpen) return;

                e.preventDefault();
                handleAddPerson();
              }
            }}
          />
          <ComboboxContent>
            <ComboboxList>
              {(person) => (
                <ComboboxItem
                  key={person.id}
                  value={person.name}
                  onClick={() => {
                    addPerson(person.name);
                    setName("");
                  }}
                >
                  {person.name}
                  {person.id === userProfile.id && " (Me)"}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Button type="button" onClick={handleAddPerson}>
          <PlusIcon />
        </Button>
      </div>

      {people.length > 0 && (
        <ItemGroup className="mx-4 space-y-2">
          {people.map((person) => (
            <PersonItem
              key={person.id}
              person={person}
              onAction={deletePerson}
            />
          ))}
        </ItemGroup>
      )}
    </div>
  );
};

export default BillPeopleSection;
