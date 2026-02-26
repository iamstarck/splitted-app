import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CircleAlertIcon } from "lucide-react";

const ProfileForm = () => {
  return (
    <form className="w-full">
      <div className="flex flex-col gap-2">
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="profile-name">Your name</FieldLabel>
            <div className="flex gap-2">
              <Input
                type="text"
                id="profile-name"
                placeholder="Enter your name"
              />
              <Button type="submit">Submit</Button>
            </div>

            <FieldError className="inline-flex items-center gap-1 text-destructive">
              <CircleAlertIcon size={"14px"} /> Error message
            </FieldError>
          </Field>
        </FieldSet>
      </div>
    </form>
  );
};

export default ProfileForm;
