import { useDataStore } from "../useDataStore";

export const useSelectFriend = () => useDataStore((state) => state.friends);
