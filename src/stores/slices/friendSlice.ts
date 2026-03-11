import { FriendProps } from "@/features/friend/types/friend";
import { generateId } from "@/shared/utils/utils";
import { StateCreator } from "zustand";
import { DataStore } from "../useDataStore";

export interface FriendSlice {
  friends: FriendProps[];

  addFriend: (name: string) => void;
  removeFriend: (id: string) => void;
}

export const createFriendSlice: StateCreator<DataStore, [], [], FriendSlice> = (
  set,
) => ({
  friends: [],

  addFriend: (name) =>
    set((state) => ({
      friends: [
        ...state.friends,
        {
          id: generateId(),
          name,
        },
      ],
    })),

  removeFriend: (id) =>
    set((state) => ({
      friends: state.friends.filter((f) => f.id !== id),
    })),
});
