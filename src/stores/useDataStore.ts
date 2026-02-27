import {
  addItemToBill,
  addPersonToBill,
  assignItemToPeople,
  generateId,
  removeItemFromBill,
  removePersonFromBill,
  updatePeopleCharges,
} from "@/features/new-bill/lib/bill.mutations";
import { initialBill, type BillProps } from "@/features/new-bill/types/bill";
import { create } from "zustand";

interface DataStore {
  profileName: string;
  currentBill: BillProps | null;
  bills: BillProps[];

  setProfileName: (name: string) => void;

  saveCurrentBill: () => void;

  addPersonToBill: (name: string) => void;
  removePersonFromBill: (personId: string) => void;

  addItemToBill: (name: string, amount: number) => void;
  removeItemFromBill: (itemId: string) => void;

  assignItemToPeople: (itemId: string, personIds: string[]) => void;

  updatePeopleCharges: (charges: Partial<BillProps["charges"]>) => void;

  resetCurrentBill: () => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  profileName: "User",
  currentBill: initialBill(),
  bills: [],

  setProfileName: (profileName) => set({ profileName }),

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
        currentBill: assignItemToPeople(state.currentBill, itemId, personIds),
      };
    }),

  updatePeopleCharges: (charges) =>
    set((state) => {
      if (!state.currentBill) return state;

      return {
        currentBill: updatePeopleCharges(state.currentBill, charges),
      };
    }),

  resetCurrentBill: () => {
    const { currentBill } = get();
    if (!currentBill) return;

    set(() => ({
      currentBill: initialBill(),
    }));
  },
}));
