import Decimal from "decimal.js";
import type { BillProps, ItemProps } from "../types/bill";

type BillSummary = {
  subtotal: Decimal;
  charges: Decimal;
  total: Decimal;
  perPerson: {
    personId: string;
    name: string;
    subtotal: Decimal;
    total: Decimal;
  }[];
  groupedByPerson: Record<string, ItemProps[]>;
  allAssigned: boolean;
  isBalanced: boolean;
  hasUnassignedPeople: boolean;
};

const calculateSubtotal = (bill: BillProps) => {
  return bill.items.reduce((sum, item) => sum.plus(item.price), new Decimal(0));
};

const calculateCharges = (bill: BillProps, subtotal: Decimal) => {
  const { taxPercent, servicePercent, tipPercent } = bill.charges;

  const percentTotal = new Decimal(taxPercent)
    .plus(servicePercent)
    .plus(tipPercent)
    .div(100);

  return subtotal.mul(percentTotal);
};

const groupItems = (bill: BillProps) => {
  const map: Record<string, ItemProps[]> = {};

  bill.people.forEach((person) => {
    map[person.id] = [];
  });

  bill.items.forEach((item) => {
    item.assignedPersonIds.forEach((personId) => {
      map[personId].push(item);
    });
  });

  return map;
};

const isAllItemsAssigned = (bill: BillProps) =>
  bill.items.every((item) => item.assignedPersonIds.length > 0);

const isSplitBalanced = (total: Decimal, assignedTotal: Decimal) => {
  return total.toDecimalPlaces(2).equals(assignedTotal.toDecimalPlaces(2));
};

export const buildBillSummary = (bill: BillProps): BillSummary => {
  const subtotal = calculateSubtotal(bill);
  const charges = calculateCharges(bill, subtotal);
  const total = subtotal.plus(charges);

  const groupedByPerson = groupItems(bill);

  const basePerPerson = bill.people.map((person) => {
    const personSubtotal = bill.items.reduce((sum, item) => {
      if (!item.assignedPersonIds.includes(person.id)) return sum;

      const split = new Decimal(item.price).div(item.assignedPersonIds.length);

      return sum.plus(split);
    }, new Decimal(0));

    return {
      personId: person.id,
      name: person.name,
      subtotal: personSubtotal,
      total: personSubtotal,
    };
  });

  const perPerson = basePerPerson.map((p) => {
    if (subtotal.equals(0)) return p;

    const ratio = p.subtotal.div(subtotal);
    const chargeShare = charges.mul(ratio);

    return {
      ...p,
      total: p.subtotal.plus(chargeShare),
    };
  });

  const assignedTotal = perPerson.reduce(
    (sum, p) => sum.plus(p.total),
    new Decimal(0),
  );

  const allAssigned = isAllItemsAssigned(bill);
  const isBalanced = isSplitBalanced(total, assignedTotal);

  const hasUnassignedPeople = Object.values(groupedByPerson).some(
    (items) => items.length === 0,
  );

  return {
    subtotal,
    charges,
    total,
    perPerson,
    groupedByPerson,
    allAssigned,
    isBalanced,
    hasUnassignedPeople,
  };
};
