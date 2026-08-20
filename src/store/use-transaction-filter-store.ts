import { create } from 'zustand';

import type { T_TransactionDirection } from '@/utils/transaction-direction';

export type T_TransactionFilter = 'all' | T_TransactionDirection;

export const TRANSACTION_FILTERS: { value: T_TransactionFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'incoming', label: 'Money in' },
  { value: 'outgoing', label: 'Money out' },
];

type T_TransactionFilterState = {
  filter: T_TransactionFilter;
  search: string;
  setFilter: (filter: T_TransactionFilter) => void;
  setSearch: (search: string) => void;
  reset: () => void;
};

const initialState = {
  filter: 'all' as T_TransactionFilter,
  search: '',
};

export const useTransactionFilterStore = create<T_TransactionFilterState>()((set) => ({
  ...initialState,
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  reset: () => set(initialState),
}));
