import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BillSlice, createBillSlice } from "./slices/billSlice";
import { createFriendSlice, FriendSlice } from "./slices/friendSlice";
import { createProfileSlice, ProfileSlice } from "./slices/profileSlice";

export type DataStore = ProfileSlice & FriendSlice & BillSlice;

export const useDataStore = create<DataStore>()(
  persist(
    (set, get, store) => ({
      ...createProfileSlice(set, get, store),
      ...createFriendSlice(set, get, store),
      ...createBillSlice(set, get, store),
    }),
    {
      name: "splitted-storage",
    },
  ),
);
