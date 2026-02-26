import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileNameSchema,
  type ProfileNameFormValues,
} from "../lib/profile-validation";
import { useForm } from "react-hook-form";

export const useProfileForm = () => {
  const defaultValues: ProfileNameFormValues = {
    profileName: "",
  };

  const form = useForm<ProfileNameFormValues>({
    resolver: zodResolver(profileNameSchema),
    defaultValues,
  });

  return { form };
};
