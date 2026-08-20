import { create } from "zustand";

type T_PreferenceState = {
  areAmountsHidden: boolean;
  toggleAmountsHidden: () => void;
};

export const usePreferenceStore = create<T_PreferenceState>()((set) => ({
  areAmountsHidden: false,
  toggleAmountsHidden: () =>
    set((state) => ({ areAmountsHidden: !state.areAmountsHidden })),
}));
