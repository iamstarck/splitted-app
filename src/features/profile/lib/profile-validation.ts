import { nameRule } from "@/shared/validation/name-rule";
import { z } from "zod";

export const profileNameSchema = z.object({
  profileName: nameRule,
});

export type ProfileNameFormValues = z.infer<typeof profileNameSchema>;
