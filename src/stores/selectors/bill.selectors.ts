import { useDataStore } from "../useDataStore";

export const useBills = () => useDataStore((state) => state.bills);

export const useCurrentBill = () => useDataStore((state) => state.currentBill);

export const useSelectPeople = () =>
  useDataStore((state) => state.currentBill?.people);

export const useSelectBillItems = () =>
  useDataStore((state) => state.currentBill?.items);

export const useSelectItemPricePerPerson = (itemId: string) => {
  return useDataStore((state) => {
    const item =
      state.currentBill?.items.find((item) => item.id === itemId) ?? null;

    if (!item) return null;
    if (item.assignedPersonIds.length === 0) return null;

    return item.price / item.assignedPersonIds.length;
  });
};
