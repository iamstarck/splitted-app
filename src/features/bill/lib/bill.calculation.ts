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
  const { taxPercent, servicePercent } = bill.charges;

  const percentTotal = new Decimal(taxPercent).plus(servicePercent).div(100);

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
    if (subtotal.equals(0)) {
      return {
        ...p,
        subtotal: p.subtotal.toDecimalPlaces(2),
        total: p.total.toDecimalPlaces(2),
      };
    }

    const ratio = p.subtotal.div(subtotal);
    const rawChargeShare = charges.mul(ratio);

    const roundedSubtotal = p.subtotal.toDecimalPlaces(2);
    const roundedChargesShare = rawChargeShare.toDecimalPlaces(2);

    return {
      ...p,
      subtotal: roundedSubtotal,
      total: p.subtotal.plus(roundedChargesShare),
    };
  });

  const totalRounded = total.toDecimalPlaces(2);

  const assignedTotal = perPerson.reduce(
    (sum, p) => sum.plus(p.total),
    new Decimal(0),
  );

  const diff = totalRounded.minus(assignedTotal);

  if (!diff.isZero() && perPerson.length > 0) {
    perPerson[0] = {
      ...perPerson[0],
      total: perPerson[0].total.plus(diff),
    };
  }

  const finalAssignedTotal = perPerson.reduce(
    (sum, p) => sum.plus(p.total),
    new Decimal(0),
  );

  const allAssigned = isAllItemsAssigned(bill);
  const isBalanced = isSplitBalanced(totalRounded, finalAssignedTotal);

  const hasUnassignedPeople = Object.values(groupedByPerson).some(
    (items) => items.length === 0,
  );

  return {
    subtotal: subtotal.toDecimalPlaces(2),
    charges: charges.toDecimalPlaces(2),
    total: totalRounded,
    perPerson,
    groupedByPerson,
    allAssigned,
    isBalanced,
    hasUnassignedPeople,
  };
};

export const buildBillListItem = (bill: BillProps) => {
  const summary = buildBillSummary(bill);

  return {
    id: bill.id,
    title: bill.title,
    currency: bill.currency,
    date: new Date(bill.date),
    total: summary.total.toNumber(),
    people: bill.people,
  };
};
