import { generateId } from "../lib/bill.mutations";

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
  currency: currencyId;
  people: PersonProps[];
  items: ItemProps[];
  charges: ChargesProps;
  createdAt: Date;
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
  currency: "$",
  people: [],
  items: [],
  charges: {
    taxPercent: 0,
    servicePercent: 0,
    tipPercent: 0,
  },
  createdAt: new Date(),
});
