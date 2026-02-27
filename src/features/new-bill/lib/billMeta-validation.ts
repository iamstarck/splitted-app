import z from "zod";
import { CURRENCIES, type currencyId } from "../types/bill";

export const billMetaSchema = z.object({
  title: z.string().min(1, { error: "Bill title is required" }),
  currency: z.enum(Object.keys(CURRENCIES) as [currencyId, ...currencyId[]], {
    message: "Select a currency",
  }),
});

export type BillMetaFormValues = z.infer<typeof billMetaSchema>;
