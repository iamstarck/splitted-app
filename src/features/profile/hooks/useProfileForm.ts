import { zodResolver } from "@hookform/resolvers/zod"
import {
  profileNameSchema,
  type ProfileNameFormValues
} from "../lib/profile-validation"
import { useForm } from "react-hook-form"

const defaultValues: ProfileNameFormValues = {
  profileName: ""
}

export const useProfileForm = () => {
  const form = useForm<ProfileNameFormValues>({
    resolver: zodResolver(profileNameSchema),
    defaultValues
  })

  return { form }
}
