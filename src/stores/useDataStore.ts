import { create } from "zustand";

interface DataStore {
  profileName: string;

  setProfileName: (name: string) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  profileName: "User",

  setProfileName: (profileName) => set({ profileName }),
}));
