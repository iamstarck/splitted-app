import {
  addItemToBill,
  addPersonToBill,
  assignItemToPeople,
  removeItemFromBill,
  removePersonFromBill,
  updatePeopleCharges,
} from "@/features/bill/lib/bill.mutations";
import { initialBill, type BillProps } from "@/features/bill/types/bill";
import { generateId } from "@/shared/utils/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataStore {
  profileName: string;
  currentBill: BillProps | null;
  bills: BillProps[];

  setProfileName: (name: string) => void;

  updateBillMeta: (
    data: Partial<Pick<BillProps, "title" | "currency" | "date" | "note">>,
  ) => void;

  addPersonToBill: (name: string) => void;
  removePersonFromBill: (personId: string) => void;

  addItemToBill: (name: string, amount: number) => void;
  removeItemFromBill: (itemId: string) => void;

  assignItemToPeople: (itemId: string, personIds: string[]) => void;

  updatePeopleCharges: (charges: Partial<BillProps["charges"]>) => void;

  saveCurrentBill: () => void;
  deleteBillById: (billId: string) => void;

  setCurrentBillById: (id: string) => void;
  updateExistingBill: () => void;

  resetCurrentBill: () => void;
}

export const useDataStore = create<DataStore>()(
  persist<DataStore>(
    (set, get) => ({
      profileName: "User",
      currentBill: initialBill(),
      bills: [],

      setProfileName: (profileName) => set({ profileName }),

      updateBillMeta: (data) =>
        set((state) => {
          if (!state.currentBill) return state;

          return {
            currentBill: {
              ...state.currentBill,
              ...data,
            },
          };
        }),

      addPersonToBill: (name) =>
        set((state) => {
          if (!state.currentBill) return state;

          return {
            currentBill: addPersonToBill(state.currentBill, name),
          };
        }),

      removePersonFromBill: (personId) =>
        set((state) => {
          if (!state.currentBill) return state;

          return {
            currentBill: removePersonFromBill(state.currentBill, personId),
          };
        }),

      addItemToBill: (name, price) =>
        set((state) => {
          if (!state.currentBill) return state;

          return {
            currentBill: addItemToBill(state.currentBill, name, price),
          };
        }),

      removeItemFromBill: (itemId) =>
        set((state) => {
          if (!state.currentBill) return state;

          return {
            currentBill: removeItemFromBill(state.currentBill, itemId),
          };
        }),

      assignItemToPeople: (itemId, personIds) =>
        set((state) => {
          if (!state.currentBill) return state;

          return {
            currentBill: assignItemToPeople(
              state.currentBill,
              itemId,
              personIds,
            ),
          };
        }),

      updatePeopleCharges: (charges) =>
        set((state) => {
          if (!state.currentBill) return state;

          return {
            currentBill: updatePeopleCharges(state.currentBill, charges),
          };
        }),

      saveCurrentBill: () => {
        const { currentBill } = get();
        if (!currentBill) return;

        set((state) => ({
          bills: [
            ...state.bills,
            {
              ...currentBill,
              id: generateId(),
            },
          ],
          currentBill: initialBill(),
        }));
      },

      deleteBillById: (billId) =>
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== billId),
        })),

      setCurrentBillById: (id) =>
        set((state) => {
          const bill = state.bills.find((bill) => bill.id === id);
          if (!bill) return state;

          return {
            currentBill: structuredClone(bill),
          };
        }),

      updateExistingBill: () => {
        const { currentBill } = get();
        if (!currentBill) return;

        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === currentBill.id ? currentBill : bill,
          ),
        }));
      },

      resetCurrentBill: () => {
        const { currentBill } = get();
        if (!currentBill) return;

        set(() => ({
          currentBill: initialBill(),
        }));
      },
    }),
    { name: "splitted-storage" },
  ),
);
