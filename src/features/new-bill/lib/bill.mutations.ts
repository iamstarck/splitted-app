import type { BillProps } from "../types/bill";

export const generateId = () => crypto.randomUUID();

export const addPersonToBill = (bill: BillProps, name: string): BillProps => {
  return {
    ...bill,
    people: [
      ...bill.people,
      {
        id: generateId(),
        name,
      },
    ],
  };
};

export const removePersonFromBill = (
  bill: BillProps,
  personId: string,
): BillProps => {
  return {
    ...bill,
    people: bill.people.filter((person) => person.id !== personId),
    items: bill.items.map((item) => ({
      ...item,
      assignedPersonIds: item.assignedPersonIds.filter((id) => id !== personId),
    })),
  };
};

export const addItemToBill = (
  bill: BillProps,
  itemName: string,
  itemPrice: number,
): BillProps => {
  return {
    ...bill,
    items: [
      ...bill.items,
      {
        id: generateId(),
        name: itemName,
        price: itemPrice,
        assignedPersonIds: [],
      },
    ],
  };
};

export const removeItemFromBill = (
  bill: BillProps,
  itemId: string,
): BillProps => {
  return {
    ...bill,
    items: bill.items.filter((item) => item.id !== itemId),
  };
};

export const assignItemToPeople = (
  bill: BillProps,
  itemId: string,
  personIds: string[],
): BillProps => {
  return {
    ...bill,
    items: bill.items.map((item) =>
      item.id === itemId ? { ...item, assignedPersonIds: personIds } : item,
    ),
  };
};

export const updatePeopleCharges = (
  bill: BillProps,
  charges: Partial<BillProps["charges"]>,
): BillProps => {
  return {
    ...bill,
    charges: {
      ...bill.charges,
      ...charges,
    },
  };
};
