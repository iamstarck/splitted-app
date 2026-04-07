import { ItemGroup } from "@/components/ui/item";
import PersonItem from "../../../../shared/components/PersonItem";
import GroupFormDialog from "../GroupFormDialog";
import { useSelectGroups } from "@/stores/selectors/group.selectors";
import { useSelectPeople } from "@/stores/selectors/bill.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { PlusIcon, UserPlusIcon, UsersIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSelectFriend } from "@/stores/selectors/friend.selectors";
import { useSelectProfile } from "@/stores/selectors/profile.selectors";
import { normalize } from "@/shared/utils/utils";
import { StaggerContainer, StaggerItem } from "@/shared/animations/StaggerAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const BillPeopleSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const userProfile = useSelectProfile();
  const friendList = useSelectFriend();
  const groups = useSelectGroups();
  const people = useSelectPeople() ?? [];
  const availablePeople = [userProfile, ...friendList].filter(
    (person) =>
      !people.some((p) => normalize(p.name) === normalize(person.name)),
  );

  const combinedItems = [
    { id: "__EDIT_GROUP__", name: "⚙️ Edit People and Group", type: "action" as const },
    ...groups.map(g => ({ ...g, id: `group_${g.id}`, name: `👥 ${g.name}`, type: "group" as const })),
    ...availablePeople.map(p => ({ ...p, id: `person_${p.id}`, type: "person" as const }))
  ];

  const addPerson = useDataStore((state) => state.addPersonToBill);
  const deletePerson = useDataStore((state) => state.removePersonFromBill);
  const addFriend = useDataStore((state) => state.addFriend);

  const [name, setName] = useState("");

  const handleAddPerson = () => {
    if (!name.trim()) return;

    addPerson(name);
    setName("");
  };

  const handleAddPersonAndFriend = () => {
    if (!name.trim()) return;

    const trimmedName = name.trim();
    // Check if this name is already a friend
    const isAlreadyFriend = friendList.some(
      (f) => normalize(f.name) === normalize(trimmedName),
    );
    const isProfile = normalize(userProfile.name) === normalize(trimmedName);

    addPerson(trimmedName);

    if (!isAlreadyFriend && !isProfile) {
      addFriend(trimmedName);
      toast.success(`${trimmedName} ditambahkan ke daftar teman!`, {
        position: "top-center",
        duration: 2000,
      });
    }

    setName("");
  };

  // Check if typed name is NOT in friends list (to show "add & save" option)
  const isNewPerson =
    name.trim().length > 0 &&
    !friendList.some((f) => normalize(f.name) === normalize(name.trim())) &&
    normalize(userProfile.name) !== normalize(name.trim());

  return (
    <>
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
            items={combinedItems}
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <ComboboxInput
              type="text"
              id="person-name"
              placeholder="Input name"
              value={name}
              className={"w-full flex-1"}
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
                {(item: any) => (
                  <ComboboxItem
                    key={item.id}
                    value={item.name}
                    onClick={(e) => {
                      if (item.type === "action") {
                        e.preventDefault();
                        setIsOpen(false);
                        setIsGroupDialogOpen(true);
                        return;
                      }
                      if (item.type === "group") {
                        item.members.forEach((m: string) => addPerson(m));
                        setName("");
                        return;
                      }
                      addPerson(item.name);
                      setName("");
                    }}
                    className={`group flex justify-between items-center w-full ${item.type === "action" ? "font-medium text-primary bg-primary/5" : ""}`}
                  >
                    <span className="truncate">
                      {item.name}
                      {item.type === "person" && item.id === `person_${userProfile.id}` && " (Me)"}
                    </span>
                    
                    {item.type === "person" && item.id !== `person_${userProfile.id}` && (
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const realId = item.id.replace("person_", "");
                          useDataStore.getState().removeFriend(realId);
                          toast.success(`${item.name} dihapus dari daftar teman.`, {
                            position: "top-center",
                            duration: 2000,
                          });
                        }}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive hover:text-destructive/80 shrink-0 cursor-pointer" />
                      </div>
                    )}

                    {item.type === "group" && (
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const realId = item.id.replace("group_", "");
                          useDataStore.getState().removeGroup(realId);
                          toast.success(`Group dihapus.`, {
                            position: "top-center",
                            duration: 2000,
                          });
                        }}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive hover:text-destructive/80 shrink-0 cursor-pointer" />
                      </div>
                    )}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          
          <Button 
            type="button" 
            onClick={handleAddPerson}
            disabled={!name.trim()}
          >
            <PlusIcon />
          </Button>
        </div>

        {/* Show "Add & Save to Friends" button when a new name is typed */}
        <AnimatePresence>
          {isNewPerson && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5"
                onClick={handleAddPersonAndFriend}
              >
                <UserPlusIcon className="h-3.5 w-3.5" />
                Tambah "{name.trim()}" & simpan ke daftar teman
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {people.length > 0 && (
          <StaggerContainer className="mx-4 space-y-2">
            {people.map((person) => (
              <StaggerItem key={person.id}>
                <ItemGroup>
                  <PersonItem
                    person={person}
                    onAction={deletePerson}
                  />
                </ItemGroup>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
      <GroupFormDialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen} />
    </>
  );
};

export default BillPeopleSection;
