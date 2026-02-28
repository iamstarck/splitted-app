import { generateId } from "@/shared/utils/utils";

export const CURRENCIES = {
  $: "US Dollar",
  Rp: "Rupiah",
} as const;

export type currencyId = keyof typeof CURRENCIES;

export type PersonProps = {
  id: string;
  name: string;
};

export type ItemProps = {
  id: string;
  name: string;
  price: number;
  assignedPersonIds: string[];
};

export type ChargesProps = {
  taxPercent: number;
  servicePercent: number;
  tipPercent: number;
};

export type BillProps = {
  id: string;
  title: string;
  date: string;
  currency: currencyId;
  note?: string;
  people: PersonProps[];
  items: ItemProps[];
  charges: ChargesProps;
};

export type AmountPerPerson = {
  personId: string;
  name: string;
  subtotal: number;
  total: number;
};

export const initialBill = (): BillProps => ({
  id: generateId(),
  title: "",
  date: new Date().toISOString(),
  currency: "$",
  note: "",
  people: [],
  items: [],
  charges: {
    taxPercent: 0,
    servicePercent: 0,
    tipPercent: 0,
  },
});
