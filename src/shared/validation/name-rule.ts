import { z } from "zod";

export const nameRule = z
  .string()
  .min(2, { error: "Min 2 characters" })
  .max(30, { error: "Max 30 characters" });
