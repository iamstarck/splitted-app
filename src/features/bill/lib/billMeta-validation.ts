import z from "zod";
import { CURRENCIES, type currencyId } from "../types/bill";

export const billMetaSchema = z.object({
  title: z.string().min(1, { error: "Bill title is required" }),
  date: z.date({ error: "Date is required" }),
  currency: z.enum(Object.keys(CURRENCIES) as [currencyId, ...currencyId[]], {
    message: "Select a currency",
  }),
  note: z.string().optional(),
});

export type BillMetaFormValues = z.infer<typeof billMetaSchema>;
