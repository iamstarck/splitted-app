import { z } from "zod";

export const profileNameSchema = z.object({
  profileName: z
    .string()
    .min(2, { error: "Min 2 characters" })
    .max(30, { error: "Max 30 characters" }),
});

export type ProfileNameFormValues = z.infer<typeof profileNameSchema>;
