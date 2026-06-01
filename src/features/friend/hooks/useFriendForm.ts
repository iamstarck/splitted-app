import { useForm } from "react-hook-form"
import {
  FriendNameFormValues,
  friendNameSchema
} from "../lib/friend-validation"
import { zodResolver } from "@hookform/resolvers/zod"

const defaultValues: FriendNameFormValues = {
  friendName: ""
}

export const useFriendForm = () => {
  const form = useForm<FriendNameFormValues>({
    resolver: zodResolver(friendNameSchema),
    defaultValues
  })

  return { form }
}
