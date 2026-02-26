import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDataStore } from "@/stores/useDataStore";
import { CircleAlertIcon } from "lucide-react";
import { useProfileForm } from "../hooks/useProfileForm";
import type { ProfileNameFormValues } from "../lib/profile-validation";

const ProfileForm = () => {
  const setProfileName = useDataStore((state) => state.setProfileName);

  const { form } = useProfileForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleChangeProfile = (values: ProfileNameFormValues) => {
    if (!values.profileName.trim()) return;

    setProfileName(values.profileName);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(handleChangeProfile)}>
      <div className="flex flex-col gap-2">
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="profile-name">Your name</FieldLabel>
            <div className="flex gap-2">
              <Input
                type="text"
                id="profile-name"
                placeholder="Enter your name"
                {...register("profileName")}
              />
              <Button type="submit">Submit</Button>
            </div>
            {errors.profileName && (
              <FieldError className="inline-flex items-center gap-1 text-destructive">
                <CircleAlertIcon size={"14px"} /> {errors.profileName.message}
              </FieldError>
            )}
          </Field>
        </FieldSet>
      </div>
    </form>
  );
};

export default ProfileForm;
