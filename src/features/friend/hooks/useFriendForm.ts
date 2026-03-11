import { useForm } from "react-hook-form";
import {
  FriendNameFormValues,
  friendNameSchema,
} from "../lib/friend-validation";
import { zodResolver } from "@hookform/resolvers/zod";

export const useFriendForm = () => {
  const defaultValues: FriendNameFormValues = {
    friendName: "",
  };

  const form = useForm<FriendNameFormValues>({
    resolver: zodResolver(friendNameSchema),
    defaultValues,
  });

  return { form };
};
