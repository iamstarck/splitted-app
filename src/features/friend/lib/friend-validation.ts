import { nameRule } from "@/shared/validation/name-rule";
import { z } from "zod";

export const friendNameSchema = z.object({
  friendName: nameRule,
});

export type FriendNameFormValues = z.infer<typeof friendNameSchema>;
