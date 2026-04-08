import { generateId } from "@/shared/utils/utils";
import { StateCreator } from "zustand";
import { DataStore } from "../useDataStore";

export interface GroupProps {
  id: string;
  name: string;
  members: string[]; // List of friend names
}

export interface GroupSlice {
  groups: GroupProps[];

  addGroup: (name: string, members: string[]) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, name: string, members: string[]) => void;
}

export const createGroupSlice: StateCreator<DataStore, [], [], GroupSlice> = (
  set,
) => ({
  groups: [],

  addGroup: (name, members) =>
    set((state) => ({
      groups: [
        ...state.groups,
        {
          id: generateId(),
          name,
          members,
        },
      ],
    })),

  removeGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
    })),

  updateGroup: (id, name, members) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === id ? { ...g, name, members } : g,
      ),
    })),
});
