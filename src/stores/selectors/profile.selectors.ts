import { useDataStore } from "../useDataStore";

export const useSelectProfile = () => useDataStore((state) => state.profile);
