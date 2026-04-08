import { useDataStore } from "../useDataStore";

export const useSelectGroups = () => {
  return useDataStore((state) => state.groups);
};
