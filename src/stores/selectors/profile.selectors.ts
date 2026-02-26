import { useDataStore } from "../useDataStore";

export const useSelectProfileName = () =>
  useDataStore((state) => state.profileName);
