import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelectFriend } from "@/stores/selectors/friend.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { toast } from "sonner";
import { UsersIcon, CheckIcon } from "lucide-react";

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupFormDialog: React.FC<GroupFormDialogProps> = ({ open, onOpenChange }) => {
  const friendList = useSelectFriend();
  const addGroup = useDataStore((state) => state.addGroup);

  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  const handleToggleFriend = (name: string) => {
    setSelectedFriends((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend");
      return;
    }

    addGroup(groupName.trim(), selectedFriends);
    toast.success(`Group "${groupName}" created successfully!`);
    
    // Reset form
    setGroupName("");
    setSelectedFriends([]);
    setFilter("");
    onOpenChange(false);
  };

  const filteredFriends = friendList.filter((f) =>
    f.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" /> Edit People & Group
          </DialogTitle>
          <DialogDescription>
            Create a new group to easily add multiple friends to a bill at once.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="e.g. Bukber Geng SMA"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Select Friends ({selectedFriends.length} selected)</Label>
            <Input
              placeholder="Search friends..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mb-2"
            />
            {friendList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                You have no friends saved yet. Add friends from the Home page first!
              </p>
            ) : (
              <ScrollArea className="h-48 border border-border rounded-md p-2">
                <div className="space-y-1">
                  {filteredFriends.map((friend) => {
                    const isSelected = selectedFriends.includes(friend.name);
                    return (
                      <div
                        key={friend.id}
                        className={`
                          flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors
                          ${isSelected ? "bg-accent/50" : "hover:bg-muted/50"}
                        `}
                        onClick={() => handleToggleFriend(friend.name)}
                      >
                        <div className={`
                          h-4 w-4 rounded-sm border flex items-center justify-center shrink-0
                          ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input"}
                        `}>
                          {isSelected && <CheckIcon className="h-3 w-3" />}
                        </div>
                        <span className="text-sm font-medium flex-1 truncate">{friend.name}</span>
                      </div>
                    );
                  })}
                  {filteredFriends.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No friends match "{filter}"
                    </p>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveGroup} disabled={!groupName.trim() || selectedFriends.length === 0}>
            Save Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupFormDialog;
