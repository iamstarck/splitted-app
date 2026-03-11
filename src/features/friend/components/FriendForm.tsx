import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDataStore } from "@/stores/useDataStore";
import { CircleAlertIcon, PlusIcon } from "lucide-react";
import { useFriendForm } from "../hooks/useFriendForm";
import { FriendNameFormValues } from "../lib/friend-validation";
import { useSelectFriend } from "@/stores/selectors/friend.selectors";
import { normalize } from "@/shared/utils/utils";

const FriendForm = () => {
  const addFriendName = useDataStore((state) => state.addFriend);
  const friendList = useSelectFriend();

  const { form } = useFriendForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = form;

  const handleAddFriend = (values: FriendNameFormValues) => {
    const name = values.friendName.trim();
    if (!name) return;

    const exists = friendList.some(
      (f) => normalize(f.name) === normalize(name),
    );

    if (exists) {
      setError("friendName", {
        message:
          "One friend, one slot. Stop trying to clone your buddy, got it?",
      });

      return;
    }

    addFriendName(name);
    reset();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(handleAddFriend)}>
      <div className="flex flex-col gap-2">
        <FieldSet>
          <Field>
            <div className="flex gap-2">
              <Input
                type="text"
                id="friend-name"
                placeholder="Add friend name"
                {...register("friendName")}
              />
              <Button type="submit">
                <PlusIcon />
              </Button>
            </div>
            {errors.friendName && (
              <FieldError className="inline-flex items-center gap-1 text-destructive">
                <CircleAlertIcon size={"14px"} /> {errors.friendName.message}
              </FieldError>
            )}
          </Field>
        </FieldSet>
      </div>
    </form>
  );
};

export default FriendForm;
