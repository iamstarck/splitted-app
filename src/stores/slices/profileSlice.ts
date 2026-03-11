import { StateCreator } from "zustand";
import { DataStore } from "../useDataStore";
import { PersonProps } from "@/features/bill/types/bill";
import { generateId } from "@/shared/utils/utils";

export interface ProfileSlice {
  profile: PersonProps;
  setProfileName: (name: string) => void;
}

export const createProfileSlice: StateCreator<
  DataStore,
  [],
  [],
  ProfileSlice
> = (set) => ({
  profile: {
    id: generateId(),
    name: "User",
  },

  setProfileName: (profileName) =>
    set((state) => ({
      profile: {
        ...state.profile,
        name: profileName,
      },
    })),
});
